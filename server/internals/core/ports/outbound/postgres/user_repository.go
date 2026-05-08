package outbound

import "github.com/adk-saugat/snapstudy/server/internals/core/domain"

type UserRepository interface {
	CreateUser(user domain.User) (*domain.User, error)
	FindByEmail(email string) (*domain.User, error)
	FindByID(id string) (*domain.User, error)
	SetSubscriptionFromCheckout(userID, customerID, subscriptionID string) error
	SetSubscriptionActiveBySubscriptionID(subscriptionID string, active bool) error
	ClearSubscriptionBySubscriptionID(subscriptionID string) error
	StartAppTrial(userID string, days int) error
}