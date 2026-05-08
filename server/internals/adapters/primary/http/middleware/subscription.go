package middleware

import (
	"net/http"
	"time"

	outbound "github.com/adk-saugat/snapstudy/server/internals/core/ports/outbound/postgres"
	"github.com/gin-gonic/gin"
)

// RequireActiveSubscription runs after AuthMiddleware and blocks lecture routes until the user has Pro or an active app trial.
func RequireActiveSubscription(users outbound.UserRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		userIDVal, ok := c.Get("userId")
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		userID, ok := userIDVal.(string)
		if !ok || userID == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		user, err := users.FindByID(userID)
		if err != nil || user == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		if !user.HasPremiumAccess(time.Now()) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "An active subscription or trial is required.",
				"code":  "SUBSCRIPTION_REQUIRED",
			})
			return
		}
		c.Next()
	}
}
