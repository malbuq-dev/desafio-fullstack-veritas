package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIError struct {
	Message string `json:"message"`
	Code    int    `json:"-"`
}

func respondError(c *gin.Context, status int, err error, publicMessage string) {
	log.Printf("Error: %v", err)
	c.JSON(status, gin.H{"error": publicMessage})
}

func respondSuccess(c *gin.Context, status int, data interface{}) {
	c.JSON(status, gin.H{"data": data})
}

func getTaskOr404(c *gin.Context, id string) *Task {
    var task Task
    if err := DB.First(&task, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
        return nil
    }
    return &task
}

func CreateTask(c *gin.Context) {
	var task Task

	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := DB.Create(&task).Error; err != nil {
		respondError(c, http.StatusInternalServerError, err, "Internal server error")
		return
	}

	c.JSON(http.StatusCreated, task)
}

func GetTasks(c *gin.Context) {
	var tasks []Task

	if err := DB.Find(&tasks).Error; err != nil {
		respondError(c, http.StatusInternalServerError, err, "Internal server error")
		return
	}

	c.JSON(http.StatusOK, tasks)
}

func GetTask(c *gin.Context) {
	id := c.Param("id")

	task := getTaskOr404(c, id)
    if task == nil {
        return
    }

	respondSuccess(c, http.StatusOK, task)
}

func UpdateTask(c *gin.Context) {
    id := c.Param("id")

    task := getTaskOr404(c, id)
    if task == nil {
        return
    }

    var input Task
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := DB.Model(&task).Updates(input).Error; err != nil {
        respondError(c, http.StatusInternalServerError, err, "Internal server error")
        return
    }

    respondSuccess(c, http.StatusOK, task)
}

func DeleteTask(c *gin.Context) {
    id := c.Param("id")
    task := getTaskOr404(c, id)
    if task == nil {
        return
    }

    if err := DB.Delete(task).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}



