package main

import (
	"evora/controllers"
	"evora/initializers"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDatabase()
}

func main() {
	r := gin.Default()

	// createEvent()

	// Events
	r.GET("/ping", controllers.TestPing)

	r.GET("/events", controllers.GetEventAll)
	r.GET("/events/:id", controllers.GetEventFromID)
	r.POST("/events", controllers.CreateEvent)
	r.PATCH("/events/update/:id")

	// Users
	r.Run("localhost:8080")
}
