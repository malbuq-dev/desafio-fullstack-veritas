package main

import "gorm.io/gorm"

type TaskStatus string

const (
	StatusPending    TaskStatus = "pending"
	StatusInProgress TaskStatus = "in_progress"
	StatusCompleted  TaskStatus = "completed"
)

type Task struct {
	gorm.Model
	Title       string     `json:"title" binding:"required"`
	Description string     `json:"description" binding:"max=500"`
	Status      TaskStatus `json:"status" gorm:"type:varchar(20); default:'pending'" binding:"required,oneof=pending in_progress completed"`
}
