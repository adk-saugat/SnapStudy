package handlers

import (
	"net/http"

	"github.com/adk-saugat/snapstudy/server/internals/core/ports/inbound"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct{
	auth inbound.AuthService
}

func NewAuthHandler(auth inbound.AuthService) *AuthHandler{
	return &AuthHandler{
		auth: auth,
	}
}

func (authHandler *AuthHandler) Register(context *gin.Context){
	var registerInput inbound.RegisterInput
	err := context.ShouldBindJSON(&registerInput)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
	}
	
	user, err := authHandler.auth.RegisterUser(registerInput)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
	}

	context.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully!",
		"user": user,
	})
}

