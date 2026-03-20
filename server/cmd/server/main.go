package main

import (
	"log"
	"os"

	httpAdapter "github.com/adk-saugat/snapstudy/server/internals/adapters/primary/http"
	"github.com/adk-saugat/snapstudy/server/internals/adapters/primary/http/handlers"
	"github.com/adk-saugat/snapstudy/server/internals/adapters/secondary/postgres"
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

	// setup router
	router := httpAdapter.NewRouter(authHandler)
	router.RegisterRoutes()

	// start http server	
	serverAddress := os.Getenv("PORT")
	if err := router.Run(":" + serverAddress); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
