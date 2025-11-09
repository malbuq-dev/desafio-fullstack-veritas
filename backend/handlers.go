package main
import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func CreateTask(c *gin.Context) {
    var task Task

    if err := c.ShouldBindJSON(&task); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, task)
}
