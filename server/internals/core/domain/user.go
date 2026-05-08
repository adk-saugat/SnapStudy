package domain

import "time"

type User struct {
	ID                   string    `json:"id" binding:"required"`
	Username             string    `json:"username" binding:"required"`
	Email                string    `json:"email" binding:"required,email"`
	Password             string    `json:"password" binding:"required"`
	CreatedAt            time.Time `json:"created_at" binding:"required"`
	StripeCustomerID     string     `json:"-"`
	StripeSubscriptionID string     `json:"-"`
	SubscriptionActive   bool       `json:"subscription_active"`
	TrialEndsAt          *time.Time `json:"trial_ends_at,omitempty"`
}

// HasPremiumAccess is true when the user has an active paid subscription or an unexpired app trial.
func (u *User) HasPremiumAccess(now time.Time) bool {
	if u.SubscriptionActive {
		return true
	}
	if u.TrialEndsAt != nil && u.TrialEndsAt.After(now) {
		return true
	}
	return false
}

func NewUser(id, username, email, password string) *User {
	return &User{
		ID:        id,
		Username:  username,
		Email:     email,
		Password:  password,
		CreatedAt: time.Now(),
	}
}