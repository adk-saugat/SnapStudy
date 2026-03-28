package http

import (
	"github.com/adk-saugat/snapstudy/server/internals/adapters/primary/http/handlers"
	"github.com/adk-saugat/snapstudy/server/internals/adapters/primary/http/middleware"
	"github.com/gin-gonic/gin"
)

type Router struct {
	engine         *gin.Engine
	authHandler    *handlers.AuthHandler
	lectureHandler *handlers.LectureHandler
}

func NewRouter(authHandler *handlers.AuthHandler, lectureHandler *handlers.LectureHandler) *Router {
	engine := gin.Default()
	engine.Use(middleware.NewCorsMiddleware())

	return &Router{
		engine:         engine,
		authHandler:    authHandler,
		lectureHandler: lectureHandler,
	}
}

func (router *Router) RegisterRoutes() {
	router.engine.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello, World!"})
	})

	router.registerAuthRoutes()
	router.registerLectureRoutes()
}

func (router *Router) registerAuthRoutes() {
	router.engine.POST("/register", router.authHandler.Register)
	router.engine.POST("/login", router.authHandler.Login)
	router.engine.POST("/logout", router.authHandler.Logout)
}

func (router *Router) registerLectureRoutes() {
	protectedLectureRoutes := router.engine.Group("/")
	protectedLectureRoutes.Use(middleware.AuthMiddleware())

	protectedLectureRoutes.POST("/lectures", router.lectureHandler.CreateLecture)
	protectedLectureRoutes.GET("/lectures", router.lectureHandler.ListUserLectures)
	// protectedLectureRoutes.GET("/lectures/:lectureId", lectureHandler.GetLecture)
	// protectedLectureRoutes.PATCH("/lectures/:lectureId", lectureHandler.UpdateLecture)
	// protectedLectureRoutes.DELETE("/lectures/:lectureId", lectureHandler.DeleteLecture)
	// protectedLectureRoutes.POST("/lectures/:lectureId/chapters", lectureHandler.CreateChapter)
	// protectedLectureRoutes.GET("/lectures/:lectureId/chapters", lectureHandler.ListChapters)
	// protectedLectureRoutes.PATCH("/lectures/:lectureId/chapters/:chapterId", lectureHandler.UpdateChapter)
	// protectedLectureRoutes.DELETE("/lectures/:lectureId/chapters/:chapterId", lectureHandler.DeleteChapter)
	// protectedLectureRoutes.POST("/lectures/:lectureId/files", lectureHandler.UploadFile)
	// protectedLectureRoutes.GET("/lectures/:lectureId/files", lectureHandler.ListFiles)
	// protectedLectureRoutes.DELETE("/lectures/:lectureId/files/:fileId", lectureHandler.DeleteFile)
}
func (r *Router) Run(port string) error {
	return r.engine.Run(port)
}
