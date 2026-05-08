package http

import (
	"github.com/adk-saugat/snapstudy/server/internals/adapters/primary/http/handlers"
	"github.com/adk-saugat/snapstudy/server/internals/adapters/primary/http/middleware"
	"github.com/gin-gonic/gin"
)

type Router struct {
	engine              *gin.Engine
	authHandler         *handlers.AuthHandler
	lectureHandler      *handlers.LectureHandler
	billingHandler      *handlers.BillingHandler
	requireSubscription gin.HandlerFunc
}

func NewRouter(
	authHandler *handlers.AuthHandler,
	lectureHandler *handlers.LectureHandler,
	billingHandler *handlers.BillingHandler,
	requireSubscription gin.HandlerFunc,
) *Router {
	engine := gin.Default()
	engine.Use(middleware.NewCorsMiddleware())

	return &Router{
		engine:              engine,
		authHandler:         authHandler,
		lectureHandler:      lectureHandler,
		billingHandler:      billingHandler,
		requireSubscription: requireSubscription,
	}
}

func (router *Router) RegisterRoutes() {
	router.engine.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello, World!"})
	})

	router.registerAuthRoutes()
	router.registerBillingRoutes()
	router.engine.POST("/webhooks/stripe", router.billingHandler.StripeWebhook)
	router.registerLectureRoutes()
}

func (router *Router) registerAuthRoutes() {
	router.engine.POST("/register", router.authHandler.Register)
	router.engine.POST("/login", router.authHandler.Login)
	router.engine.POST("/logout", router.authHandler.Logout)
}

func (router *Router) registerBillingRoutes() {
	authed := router.engine.Group("/")
	authed.Use(middleware.AuthMiddleware())
	authed.GET("/billing/status", router.billingHandler.Status)
	authed.POST("/billing/start-trial", router.billingHandler.StartAppTrial)
	authed.POST("/billing/sync-checkout", router.billingHandler.SyncCheckoutSession)
	authed.POST("/billing/checkout-session", router.billingHandler.CreateCheckoutSession)
}

func (router *Router) registerLectureRoutes() {
	protectedLectureRoutes := router.engine.Group("/")
	protectedLectureRoutes.Use(middleware.AuthMiddleware(), router.requireSubscription)

	protectedLectureRoutes.POST("/lectures", router.lectureHandler.CreateLecture)
	protectedLectureRoutes.GET("/lectures", router.lectureHandler.ListUserLectures)
	protectedLectureRoutes.PATCH("/lectures/:lectureId", router.lectureHandler.UpdateLecture)
	protectedLectureRoutes.DELETE("/lectures/:lectureId", router.lectureHandler.DeleteLecture)
	// protectedLectureRoutes.GET("/lectures/:lectureId", lectureHandler.GetLecture)
	// protectedLectureRoutes.POST("/lectures/:lectureId/chapters", lectureHandler.CreateChapter)
	protectedLectureRoutes.GET("/lectures/:lectureId/chapters/:chapterId/pdf", router.lectureHandler.DownloadChapterPDF)
	protectedLectureRoutes.GET("/lectures/:lectureId/chapters", router.lectureHandler.ListChapters)
	protectedLectureRoutes.GET("/lectures/:lectureId/pdf", router.lectureHandler.DownloadLecturePDF)
	// protectedLectureRoutes.PATCH("/lectures/:lectureId/chapters/:chapterId", lectureHandler.UpdateChapter)
	// protectedLectureRoutes.DELETE("/lectures/:lectureId/chapters/:chapterId", lectureHandler.DeleteChapter)
	protectedLectureRoutes.POST("/lectures/:lectureId/files", router.lectureHandler.UploadFile)
	protectedLectureRoutes.GET("/lectures/:lectureId/files", router.lectureHandler.ListFiles)
	protectedLectureRoutes.DELETE("/lectures/:lectureId/files/:fileId", router.lectureHandler.DeleteFile)
}
func (r *Router) Run(port string) error {
	return r.engine.Run(port)
}
