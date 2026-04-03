package middleware

import (
	"os"

	ginCors "github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewCorsMiddleware() gin.HandlerFunc {
	webUrl := os.Getenv("WEB_URL")
	return ginCors.New(ginCors.Config{
		AllowOrigins:     []string{webUrl},
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	})
}
