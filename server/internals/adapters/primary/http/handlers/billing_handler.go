package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/adk-saugat/snapstudy/server/internals/core/domain"
	outbound "github.com/adk-saugat/snapstudy/server/internals/core/ports/outbound/postgres"
	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v81"
	checkoutsession "github.com/stripe/stripe-go/v81/checkout/session"
	stripewebhook "github.com/stripe/stripe-go/v81/webhook"
)

type BillingHandler struct {
	users outbound.UserRepository
}

func NewBillingHandler(users outbound.UserRepository) *BillingHandler {
	return &BillingHandler{users: users}
}

func billingStatusMap(user *domain.User) gin.H {
	now := time.Now()
	trialActive := user.TrialEndsAt != nil && user.TrialEndsAt.After(now)
	var trialEndsAt *string
	if user.TrialEndsAt != nil {
		s := user.TrialEndsAt.Format(time.RFC3339)
		trialEndsAt = &s
	}
	return gin.H{
		"subscription_active": user.SubscriptionActive,
		"trial_active":        trialActive,
		"trial_ends_at":       trialEndsAt,
		"has_premium_access":  user.HasPremiumAccess(now),
	}
}

func (h *BillingHandler) Status(c *gin.Context) {
	userIDVal, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID, ok := userIDVal.(string)
	if !ok || userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	user, err := h.users.FindByID(userID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	c.JSON(http.StatusOK, billingStatusMap(user))
}

func (h *BillingHandler) StartAppTrial(c *gin.Context) {
	userIDVal, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID, ok := userIDVal.(string)
	if !ok || userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	days := 14
	if raw := os.Getenv("APP_FREE_TRIAL_DAYS"); raw != "" {
		if n, err := strconv.Atoi(raw); err == nil && n > 0 {
			days = n
		}
	}
	err := h.users.StartAppTrial(userID, days)
	if err != nil {
		if err.Error() == "trial not available for this user" {
			c.JSON(http.StatusConflict, gin.H{
				"error": "You can’t start a free trial (already used, still active, or you’re subscribed). Use Pro to pay and continue.",
			})
			return
		}
		log.Printf("StartAppTrial: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not start trial."})
		return
	}
	user, err := h.users.FindByID(userID)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"message": "Trial started."})
		return
	}
	resp := billingStatusMap(user)
	resp["message"] = "Trial started."
	c.JSON(http.StatusOK, resp)
}

// SyncCheckoutSession loads a completed Stripe Checkout session and updates the user row.
// Use this when returning from success_url so local/dev works without webhooks.
func (h *BillingHandler) SyncCheckoutSession(c *gin.Context) {
	secret := os.Getenv("STRIPE_SECRET_KEY")
	if secret == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Billing is not configured."})
		return
	}
	stripe.Key = secret

	userIDVal, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID, ok := userIDVal.(string)
	if !ok || userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req struct {
		SessionID string `json:"session_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "session_id required"})
		return
	}

	params := &stripe.CheckoutSessionParams{}
	params.AddExpand("customer")
	params.AddExpand("subscription")

	sess, err := checkoutsession.Get(req.SessionID, params)
	if err != nil {
		log.Printf("stripe checkout session Get: %v", err)
		c.JSON(http.StatusBadGateway, gin.H{"error": "Could not load checkout session."})
		return
	}

	if sess.Mode != stripe.CheckoutSessionModeSubscription {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not a subscription checkout session."})
		return
	}

	ownerID := ""
	if sess.Metadata != nil {
		ownerID = sess.Metadata["user_id"]
	}
	if ownerID == "" {
		ownerID = sess.ClientReferenceID
	}
	if ownerID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "This checkout belongs to a different account."})
		return
	}

	if sess.Status != stripe.CheckoutSessionStatusComplete {
		user, err := h.users.FindByID(userID)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		out := billingStatusMap(user)
		out["checkout_synced"] = false
		out["checkout_status"] = sess.Status
		c.JSON(http.StatusOK, out)
		return
	}

	paid := sess.PaymentStatus == stripe.CheckoutSessionPaymentStatusPaid ||
		sess.PaymentStatus == stripe.CheckoutSessionPaymentStatusNoPaymentRequired
	if !paid {
		user, err := h.users.FindByID(userID)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		out := billingStatusMap(user)
		out["checkout_synced"] = false
		out["payment_status"] = sess.PaymentStatus
		c.JSON(http.StatusOK, out)
		return
	}

	customerID := ""
	if sess.Customer != nil {
		customerID = sess.Customer.ID
	}
	subID := ""
	if sess.Subscription != nil {
		subID = sess.Subscription.ID
	}
	if customerID == "" || subID == "" {
		log.Printf("sync checkout: session %s missing customer or subscription id", req.SessionID)
		c.JSON(http.StatusBadGateway, gin.H{"error": "Checkout session missing subscription details."})
		return
	}

	if err := h.users.SetSubscriptionFromCheckout(userID, customerID, subID); err != nil {
		log.Printf("sync SetSubscriptionFromCheckout: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save subscription."})
		return
	}

	user, err := h.users.FindByID(userID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	out := billingStatusMap(user)
	out["checkout_synced"] = true
	c.JSON(http.StatusOK, out)
}

func (h *BillingHandler) CreateCheckoutSession(c *gin.Context) {
	secret := os.Getenv("STRIPE_SECRET_KEY")
	if secret == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Billing is not configured."})
		return
	}
	priceID := os.Getenv("STRIPE_PRICE_ID")
	if priceID == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Stripe price is not configured."})
		return
	}
	stripe.Key = secret

	userIDVal, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID, ok := userIDVal.(string)
	if !ok || userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	user, err := h.users.FindByID(userID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	frontend := strings.TrimSuffix(strings.TrimSpace(os.Getenv("FRONTEND_URL")), "/")
	if frontend == "" {
		frontend = "http://localhost:5173"
	}
	successURL := frontend + "/billing/success?session_id={CHECKOUT_SESSION_ID}"
	cancelURL := frontend + "/billing/cancel"

	params := &stripe.CheckoutSessionParams{
		Mode:       stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		SuccessURL: stripe.String(successURL),
		CancelURL:  stripe.String(cancelURL),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(priceID),
				Quantity: stripe.Int64(1),
			},
		},
		ClientReferenceID: stripe.String(userID),
	}
	params.Metadata = map[string]string{"user_id": userID}
	if user.StripeCustomerID != "" {
		params.Customer = stripe.String(user.StripeCustomerID)
	} else {
		params.CustomerEmail = stripe.String(user.Email)
	}

	sess, err := checkoutsession.New(params)
	if err != nil {
		log.Printf("stripe checkout session: %v", err)
		c.JSON(http.StatusBadGateway, gin.H{"error": "Could not start checkout. Try again later."})
		return
	}
	if sess.URL == "" {
		c.JSON(http.StatusBadGateway, gin.H{"error": "Checkout URL missing from Stripe response."})
		return
	}
	c.JSON(http.StatusOK, gin.H{"url": sess.URL})
}

func (h *BillingHandler) StripeWebhook(c *gin.Context) {
	secret := os.Getenv("STRIPE_WEBHOOK_SECRET")
	if secret == "" {
		log.Print("STRIPE_WEBHOOK_SECRET is not set")
		c.Status(http.StatusServiceUnavailable)
		return
	}
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	sig := c.GetHeader("Stripe-Signature")
	event, err := stripewebhook.ConstructEvent(body, sig, secret)
	if err != nil {
		log.Printf("stripe webhook ConstructEvent: %v", err)
		c.Status(http.StatusBadRequest)
		return
	}

	switch event.Type {
	case stripe.EventTypeCheckoutSessionCompleted:
		var sess stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &sess); err != nil {
			log.Printf("stripe webhook parse checkout session: %v", err)
			break
		}
		if sess.Mode != stripe.CheckoutSessionModeSubscription {
			break
		}
		userID := ""
		if sess.Metadata != nil {
			userID = sess.Metadata["user_id"]
		}
		if userID == "" && sess.ClientReferenceID != "" {
			userID = sess.ClientReferenceID
		}
		customerID := ""
		if sess.Customer != nil {
			customerID = sess.Customer.ID
		}
		subID := ""
		if sess.Subscription != nil {
			subID = sess.Subscription.ID
		}
		if userID == "" || customerID == "" || subID == "" {
			log.Printf("stripe checkout.session.completed missing ids user=%q customer=%q sub=%q", userID, customerID, subID)
			break
		}
		if err := h.users.SetSubscriptionFromCheckout(userID, customerID, subID); err != nil {
			log.Printf("stripe SetSubscriptionFromCheckout: %v", err)
		}
	case stripe.EventTypeCustomerSubscriptionUpdated:
		var sub stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &sub); err != nil {
			log.Printf("stripe webhook parse subscription: %v", err)
			break
		}
		active := sub.Status == stripe.SubscriptionStatusActive || sub.Status == stripe.SubscriptionStatusTrialing
		if err := h.users.SetSubscriptionActiveBySubscriptionID(sub.ID, active); err != nil {
			log.Printf("stripe SetSubscriptionActiveBySubscriptionID: %v", err)
		}
	case stripe.EventTypeCustomerSubscriptionDeleted:
		var sub stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &sub); err != nil {
			log.Printf("stripe webhook parse subscription deleted: %v", err)
			break
		}
		if err := h.users.ClearSubscriptionBySubscriptionID(sub.ID); err != nil {
			log.Printf("stripe ClearSubscriptionBySubscriptionID: %v", err)
		}
	default:
		// ignore other events
	}
	c.Status(http.StatusOK)
}
