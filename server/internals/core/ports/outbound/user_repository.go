package outbound

import "github.com/adk-saugat/snapstudy/server/internals/core/domain"

type UserRepository interface {
	CreateUser(user domain.User) (*domain.User, error)
	FindByEmail(email string) (*domain.User, error)
}