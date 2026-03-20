package application

import (
	"time"

	"github.com/adk-saugat/snapstudy/server/internals/core/domain"
	"github.com/adk-saugat/snapstudy/server/internals/core/ports/inbound"
	"github.com/adk-saugat/snapstudy/server/internals/core/ports/outbound"
	"github.com/adk-saugat/snapstudy/server/pkg/hasher"
)

type AuthService struct {
	userRepository outbound.UserRepository
}

func NewAuthService(userRepository outbound.UserRepository) *AuthService {
	return &AuthService{userRepository: userRepository}
}

func (s *AuthService) RegisterUser(registerInput inbound.RegisterInput) (*inbound.RegisterResponse, error) {
	user := domain.User{
		Username: registerInput.Username,
		Email:    registerInput.Email,
		Password: registerInput.Password,
		CreatedAt: time.Now(),
	}

	hashedPassword, err := hasher.HashPassword(user.Password)
	if err != nil {
		return nil, err
	}
	user.Password = hashedPassword

	createdUser, err := s.userRepository.CreateUser(user)
	if err != nil {
		return nil, err
	}

	return &inbound.RegisterResponse{
		ID:        createdUser.ID,
		Username:  createdUser.Username,
		Email:     createdUser.Email,
		CreatedAt: createdUser.CreatedAt,
	}, nil
}