package application

import (
	"github.com/adk-saugat/snapstudy/server/internals/core/domain"
	"github.com/adk-saugat/snapstudy/server/internals/core/ports/outbound"
)

type AuthService struct {
	userRepository outbound.UserRepository
}

func NewAuthService(userRepository outbound.UserRepository) *AuthService {
	return &AuthService{userRepository: userRepository}
}

func (s *AuthService) RegisterUser(user domain.User) error {
	return s.userRepository.CreateUser(user)
}