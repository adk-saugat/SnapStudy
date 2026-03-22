package inbound

import (
	"time"

	"github.com/adk-saugat/snapstudy/server/internals/core/domain"
)

type RegisterInput struct{
	Username  string 	`json:"username" binding:"required"`
	Email     string 	`json:"email" binding:"required,email"`
	Password  string 	`json:"password" binding:"required"`
}

type RegisterResponse struct{
	ID        string 	`json:"id"`
	Username  string 	`json:"username"`
	Email     string 	`json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

type LoginInput struct{
	Email     string 	`json:"email" binding:"required,email"`
	Password  string 	`json:"password" binding:"required"`
}

type LoginResponse struct{
	User    domain.User `json:"user"`
	Token string `json:"token"`
}

type AuthService interface {
	RegisterUser(registerInput RegisterInput) (*RegisterResponse, error)
	LoginUser(loginInput LoginInput) (*LoginResponse, error)
}

