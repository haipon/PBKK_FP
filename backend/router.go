package main

import (
	"evora/controllers"
	"evora/initializers"
	"evora/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDatabase()
}

func main() {
	r := gin.Default()

	// CORS Setup
	config := cors.DefaultConfig()

	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	config.AllowCredentials = true

	r.Use(cors.New(config))

	// --- For guest & user ---
	// Events
	r.GET("/events", controllers.GetEventAll)
	r.GET("/events/:id", controllers.GetEventFromID)

	// Users
	r.POST("/signup", controllers.Signup)
	r.POST("/login", controllers.Signin)

	// --- For user only ---
	authorized := r.Group("/")
	authorized.Use(middleware.RequireAuth)
	{
		// Events
		authorized.POST("/events/create", controllers.CreateEvent)
		authorized.PATCH("/events/update/:id", controllers.UpdateEventByID)
		authorized.POST("/events/update/images/:id", controllers.UploadEventImage)
		authorized.DELETE("/events/update/:id", controllers.DeleteEventByIDSoft)
		authorized.POST("/events/:id/book", controllers.BookEvent)

		// Users
		authorized.GET("/profile/events", controllers.GetEventCreatedByUser)
		authorized.GET("/profile/booked", controllers.GetEventBookedByUser)

		// Testing
		authorized.GET("/ping", controllers.TestPing)
	}

	r.Run("127.0.0.1:8080")
}
