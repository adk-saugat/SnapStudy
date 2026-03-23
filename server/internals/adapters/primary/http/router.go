package http

import (
	"github.com/adk-saugat/snapstudy/server/internals/adapters/primary/http/handlers"
	"github.com/adk-saugat/snapstudy/server/internals/adapters/primary/http/middleware"
	"github.com/gin-gonic/gin"
)

type Router struct {
	engine      *gin.Engine
	authHandler *handlers.AuthHandler
}

func NewRouter(authHandler *handlers.AuthHandler) *Router {
	engine := gin.Default()
	engine.Use(middleware.NewCorsMiddleware())

	return &Router{
		engine:      engine,
		authHandler: authHandler,
	}
}

func (router *Router) RegisterRoutes() {
	router.engine.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello, World!"})
	})
	router.engine.POST("/register", router.authHandler.Register)
	router.engine.POST("/login", router.authHandler.Login)

}
func (r *Router) Run(port string) error {
	return r.engine.Run(port)
}
