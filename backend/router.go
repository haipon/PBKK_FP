package main

import (
	"evora/controllers"
	"evora/initializers"
	"evora/middleware"

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
	r.GET("/events", controllers.GetEventAll)
	r.GET("/events/:id", controllers.GetEventFromID)
	r.POST("/events/create", controllers.CreateEvent)

	r.PATCH("/events/update/:id", controllers.UpdateEventByID)
	r.DELETE("/events/update/:id", controllers.DeleteEventByIDSoft)
	r.POST("/events/update/images/:id", controllers.UploadEventImage)

	// Users
	r.POST("/signup", controllers.Signup)
	r.GET("/login", controllers.Signin)
	r.GET("/ping", middleware.RequireAuth, controllers.TestPing)

	r.Run("127.0.0.1:8080")
}
