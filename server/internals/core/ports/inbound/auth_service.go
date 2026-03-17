package inbound

import "github.com/adk-saugat/snapstudy/server/internals/core/domain"

type AuthService interface {
	RegisterUser(user domain.User) error
}