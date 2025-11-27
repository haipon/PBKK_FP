package main

import (
	"evora/initializers"
	"evora/models"
	"fmt"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDatabase()
}

func main() {
	initializers.DB.AutoMigrate(&models.Event{}, &models.User{})
	fmt.Println("Database successfully created!")
}
