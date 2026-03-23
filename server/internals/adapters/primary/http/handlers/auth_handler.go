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
		return
	}
	
	user, err := authHandler.auth.RegisterUser(registerInput)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	context.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully!",
		"user": user,
	})
}

func (authHandler *AuthHandler) Login(context *gin.Context){
	var loginInput inbound.LoginInput
	err := context.ShouldBindJSON(&loginInput)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	response, err := authHandler.auth.LoginUser(loginInput)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	const tokenMaxAgeSeconds = 60 * 60 * 24 // 24 hours
	const secureCookie = false
	const httpOnlyCookie = true

	context.SetSameSite(http.SameSiteLaxMode)
	context.SetCookie(
		"access_token",
		response.Token,
		tokenMaxAgeSeconds,
		"/",
		"",
		secureCookie,
		httpOnlyCookie,
	)

	context.JSON(http.StatusOK, gin.H{
		"message": "User logged in successfully!",
	})
}