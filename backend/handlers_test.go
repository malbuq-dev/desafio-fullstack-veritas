package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	sqlite "github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

type singleTaskResponse struct {
	Data Task `json:"data"`
}

type tasksResponse struct {
	Data []Task `json:"data"`
}

func setupTestDB(t *testing.T) *gorm.DB {
	t.Helper()

	db, err := gorm.Open(sqlite.Open("file::memory:?mode=memory&cache=private"), &gorm.Config{}) //Ponto importante: precisei settar o cache pra private pra não dar conflito entre testes

	if err != nil {
		t.Fatalf("failed to open test db: %v", err)
	}

	if err := db.AutoMigrate(&Task{}); err != nil {
		t.Fatalf("failed to migrate test db: %v", err)
	}

	return db
}

func setupTestRouter() *gin.Engine {
	r := gin.Default()

	taskRoutes := r.Group("/tasks")
	{
		taskRoutes.POST("/", CreateTask)
		taskRoutes.GET("/", GetTasks)
		taskRoutes.GET("/:id", GetTask)
		taskRoutes.PUT("/:id", UpdateTask)
		taskRoutes.DELETE("/:id", DeleteTask)
	}

	return r
}

func init() {
	gin.SetMode(gin.TestMode)
}

func TestCreateTask(t *testing.T) {
	DB = setupTestDB(t)
	router := setupTestRouter()

	body := map[string]any{
		"title":       "Veritas Task",
		"description": "Desafio full-stack com GO e React",
		"status":      "pending",
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest(http.MethodPost, "/tasks/", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusCreated {
		t.Fatalf("expected status %d, got %d, body=%s", http.StatusCreated, rr.Code, rr.Body.String())
	}

	var resp singleTaskResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}

	if resp.Data.Title != "Veritas Task" {
		t.Errorf("expected title %q, got %q", "Veritas Task", resp.Data.Title)
	}
	if resp.Data.Status != StatusPending {
		t.Errorf("expected status %q, got %q", StatusPending, resp.Data.Status)
	}
}

func TestGetTasks(t *testing.T) {
	DB = setupTestDB(t)
	router := setupTestRouter()

	DB.Create(&Task{Title: "Task 1", Description: "First", Status: StatusPending})
	DB.Create(&Task{Title: "Task 2", Description: "Second", Status: StatusCompleted})

	req, _ := http.NewRequest(http.MethodGet, "/tasks/", nil)
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d, body=%s", http.StatusOK, rr.Code, rr.Body.String())
	}

	var resp tasksResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}

	if len(resp.Data) != 2 {
		t.Errorf("expected 2 tasks, got %d", len(resp.Data))
	}
}

func TestGetTask(t *testing.T) {
	DB = setupTestDB(t)
	router := setupTestRouter()

	task := Task{Title: "Single", Description: "Just one", Status: StatusPending}
	DB.Create(&task)

	req, _ := http.NewRequest(http.MethodGet, "/tasks/1", nil)
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d, body=%s", http.StatusOK, rr.Code, rr.Body.String())
	}

	var resp singleTaskResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}

	if resp.Data.Title != "Single" {
		t.Errorf("expected title %q, got %q", "Single", resp.Data.Title)
	}
}

func TestGetTaskNotFound(t *testing.T) {
	DB = setupTestDB(t)
	router := setupTestRouter()

	req, _ := http.NewRequest(http.MethodGet, "/tasks/999", nil)
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusNotFound {
		t.Fatalf("expected status %d, got %d, body=%s", http.StatusNotFound, rr.Code, rr.Body.String())
	}
}

func TestUpdateTask(t *testing.T) {
	DB = setupTestDB(t)
	router := setupTestRouter()

	DB.Create(&Task{Title: "Old", Description: "Old desc", Status: StatusPending})

	body := map[string]any{
		"title":  "New Veritas Task",
		"status": "completed",
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest(http.MethodPut, "/tasks/1", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d, body=%s", http.StatusOK, rr.Code, rr.Body.String())
	}

	var resp singleTaskResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}

	if resp.Data.Title != "New Veritas Task" {
		t.Errorf("expected title %q, got %q", "New Veritas Task", resp.Data.Title)
	}
	if resp.Data.Status != StatusCompleted {
		t.Errorf("expected status %q, got %q", StatusCompleted, resp.Data.Status)
	}
}

func TestDeleteTask(t *testing.T) {
	DB = setupTestDB(t)
	router := setupTestRouter()

	DB.Create(&Task{Title: "Delete me", Description: "bye", Status: StatusPending})

	req, _ := http.NewRequest(http.MethodDelete, "/tasks/1", nil)
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d, body=%s", http.StatusOK, rr.Code, rr.Body.String())
	}

	var resp map[string]string
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}

	if msg, ok := resp["message"]; !ok || msg != "Task deleted successfully" {
		t.Errorf("expected message %q, got %q", "Task deleted successfully", msg)
	}

	var count int64
	if err := DB.Model(&Task{}).Where("id = ?", 1).Count(&count).Error; err != nil {
		t.Fatalf("failed counting tasks: %v", err)
	}
	if count != 0 {
		t.Errorf("expected 0 tasks with id=1, got %d", count)
	}
}
