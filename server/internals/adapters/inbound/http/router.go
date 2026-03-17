package http

import "github.com/gin-gonic/gin"

type Router struct {
	engine *gin.Engine
}

func NewRouter() *Router {
	return &Router{
		engine: gin.Default(),
	}
}

func (router *Router) RegisterRoutes() {
	router.engine.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello, World!"})
	})
}
func (r *Router) Run(port string) error{
	return r.engine.Run(port)
}