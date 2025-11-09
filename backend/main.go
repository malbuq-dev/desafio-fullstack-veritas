package main
import (
    "fmt"
    "log"
    "os"

    "github.com/joho/godotenv"
)

func main() {
    _ = godotenv.Load()

    port := os.Getenv("PORT")

    if port == "" { //Edge case pra rodar localmente
        port = "8080"
    }

	ConnectDatabase()
    DB.AutoMigrate(&Task{})

    router := SetupRouter()
    log.Printf("Running on http://localhost:%s", port)
    router.Run(fmt.Sprintf(":%s", port))
}
