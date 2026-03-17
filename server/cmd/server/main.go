package main

import (
	"log"

	httpAdapter "github.com/adk-saugat/snapstudy/server/internals/adapters/inbound/http"
)

func main() {
	router := httpAdapter.NewRouter()
	router.RegisterRoutes()

	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
