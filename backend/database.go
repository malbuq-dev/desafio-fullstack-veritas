package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, skipping...")
	}

	dsn := os.Getenv("DB_URL")

	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to Supabase:", err)
	}

	DB = db
	log.Println("Connected to Database successfully!")
}
