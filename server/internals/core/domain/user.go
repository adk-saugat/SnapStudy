package domain

import "time"

type User struct {
	ID        string 	`json:"id" binding:"required"`
	Username  string 	`json:"username" binding:"required"`
	Email     string 	`json:"email" binding:"required,email"`
	Password  string 	`json:"password" binding:"required"`
	CreatedAt time.Time `json:"created_at" binding:"required"`
}

func (u *User) NewUser(id, username, email, password string) *User {
	return &User{
		ID:        id,
		Username:  username,
		Email:     email,
		Password:  password,
		CreatedAt: time.Now(),
	}
}