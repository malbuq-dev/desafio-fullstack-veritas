package main

import "github.com/gin-gonic/gin"

func SetupRouter() *gin.Engine {
	router := gin.Default()

	taskRoutes := router.Group("/tasks")
	{
		taskRoutes.POST("/", CreateTask)
	}

	return router
}
