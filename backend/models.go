package main

import "gorm.io/gorm"

type TaskStatus string

const (
    StatusPending   TaskStatus = "pending"
    StatusInProgress TaskStatus = "in_progress"
    StatusCompleted  TaskStatus = "completed"
)

type Task struct {
    gorm.Model
    Title       string     `json:"title"`
    Description string     `json:"description"`
    Status      TaskStatus `json:"status" gorm:"type:varchar(20);default:'pending'"`
}
