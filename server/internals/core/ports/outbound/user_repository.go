package outbound

import "github.com/adk-saugat/snapstudy/server/internals/core/domain"

type UserRepository interface {
	CreateUser(user domain.User) error
}