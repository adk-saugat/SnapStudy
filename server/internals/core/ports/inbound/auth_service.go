package inbound

import "time"

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

type AuthService interface {
	RegisterUser(registerInput RegisterInput) (*RegisterResponse, error)
}

