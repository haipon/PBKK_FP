package main

import (
	"evora/initializers"
	"evora/models"
	"fmt"
	"log"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDatabase()
}

func main() {
	err := initializers.DB.AutoMigrate(&models.Event{}, &models.User{})
	if err != nil {
		log.Fatal(err)
		return
	}
	fmt.Println("Database successfully created!")
}
