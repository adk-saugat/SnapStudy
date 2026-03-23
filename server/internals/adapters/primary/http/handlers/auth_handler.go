package handlers

import (
	"net/http"

	"github.com/adk-saugat/snapstudy/server/internals/core/ports/inbound"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	auth inbound.AuthService
}

type loginUserResponse struct {
	ID        string `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	CreatedAt string `json:"created_at"`
}

func NewAuthHandler(auth inbound.AuthService) *AuthHandler {
	return &AuthHandler{
		auth: auth,
	}
}

func (authHandler *AuthHandler) Register(context *gin.Context) {
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
		"user":    user,
	})
}

func (authHandler *AuthHandler) Login(context *gin.Context) {
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
		"user": loginUserResponse{
			ID:        response.User.ID,
			Username:  response.User.Username,
			Email:     response.User.Email,
			CreatedAt: response.User.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		},
		"message": "User logged in successfully!",
	})
}

func (authHandler *AuthHandler) Logout(context *gin.Context) {
	const secureCookie = false
	const httpOnlyCookie = true

	context.SetSameSite(http.SameSiteLaxMode)
	context.SetCookie(
		"access_token",
		"",
		-1,
		"/",
		"",
		secureCookie,
		httpOnlyCookie,
	)

	context.JSON(http.StatusOK, gin.H{
		"message": "User logged out successfully!",
	})
}
