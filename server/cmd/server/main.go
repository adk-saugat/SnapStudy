package main

import (
	"context"
	"log"
	"os"

	httpAdapter "github.com/adk-saugat/snapstudy/server/internals/adapters/primary/http"
	"github.com/adk-saugat/snapstudy/server/internals/adapters/primary/http/handlers"
	markdownadapter "github.com/adk-saugat/snapstudy/server/internals/adapters/secondary/markdown"
	"github.com/adk-saugat/snapstudy/server/internals/adapters/secondary/postgres"
	s3storage "github.com/adk-saugat/snapstudy/server/internals/adapters/secondary/s3"
	textractadapter "github.com/adk-saugat/snapstudy/server/internals/adapters/secondary/textract"
	"github.com/adk-saugat/snapstudy/server/internals/application"
	"github.com/joho/godotenv"
)

func main() {
	// load environment variables
	if err := godotenv.Load("../../.env"); err != nil {
		log.Printf("No .env file found, using process environment")
	}

	// connect to postgres
	connectionString := os.Getenv("POSTGRES_CONNECTION_STRING")
	db, err := postgres.NewDB(connectionString)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// verify database connection
	if err := db.Ping(); err != nil {
		log.Fatalf("Database ping failed: %v", err)
	}
	log.Println("Database ping successful")

	// wire application dependencies
	userStore := postgres.NewUserStore(db)
	authService := application.NewAuthService(userStore)
	authHandler := handlers.NewAuthHandler(authService)

	lectureStore := postgres.NewLectureStore(db)
	lectureChapterStore := postgres.NewLectureChapterStore(db)
	lectureFileStore := postgres.NewLectureFileStore(db)

	s3Bucket := os.Getenv("S3_BUCKET")
	awsRegion := os.Getenv("AWS_REGION")
	if awsRegion == "" {
		awsRegion = "us-east-1"
	}
	if s3Bucket == "" {
		log.Fatal("S3_BUCKET is required")
	}
	objectStorage, err := s3storage.NewUploader(context.Background(), s3Bucket, awsRegion)
	if err != nil {
		log.Fatalf("failed to init S3 transfer manager: %v", err)
	}

	textExtractor, err := textractadapter.NewAWSDocumentTextExtractor(context.Background(), awsRegion)
	if err != nil {
		log.Fatalf("failed to init textract client: %v", err)
	}

	geminiAPIKey := os.Getenv("GEMINI_API_KEY")
	markdownFormatter, err := markdownadapter.NewGeminiFormatter(geminiAPIKey)
	if err != nil {
		log.Fatalf("failed to init gemini formatter: %v", err)
	}

	lectureService := application.NewLectureService(
		lectureStore,
		lectureChapterStore,
		lectureFileStore,
		objectStorage,
		textExtractor,
		markdownFormatter,
		s3Bucket,
	)
	lectureHandler := handlers.NewLectureHandler(lectureService)

	// setup router
	router := httpAdapter.NewRouter(authHandler, lectureHandler)
	router.RegisterRoutes()

	// start http server
	serverAddress := os.Getenv("PORT")
	if err := router.Run(":" + serverAddress); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
