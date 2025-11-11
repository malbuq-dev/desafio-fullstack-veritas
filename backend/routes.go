package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func SetupRouter() *gin.Engine {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, skipping...")
	}

	router := gin.Default()

	config := cors.Config{
		AllowOrigins: []string{
			os.Getenv("FRONT_END_URL_DEV"), 
		},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders: []string{"Content-Length"},
		AllowCredentials: true,
	}

	router.Use(cors.New(config))

	taskRoutes := router.Group("/tasks")
	{
		taskRoutes.POST("/", CreateTask)
		taskRoutes.GET("/", GetTasks)
		taskRoutes.GET("/:id", GetTask)
		taskRoutes.PUT("/:id", UpdateTask)
		taskRoutes.DELETE("/:id", DeleteTask)
	}

	return router
}
