package controllers

import (
	"evora/initializers"
	"evora/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateEvent(c *gin.Context) {
	// Struct to bind JSON data with
	type event struct {
		CreatedAt   time.Time `json:"created_at"`
		Name        string    `json:"name"`
		Description string    `json:"description"`
		Location    string    `json:"location"`
		TimeStart   time.Time `json:"time_start"`
	}

	// Bind the data then insert to database
	newEvent := event{}

	if err := c.BindJSON(&newEvent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
	}

	results := initializers.DB.Create(&newEvent)

	// Send the appropriate data
	if results.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": results.Error})
	}

	c.JSON(http.StatusOK, newEvent)
}

func GetEventAll(c *gin.Context) {
	event := []models.Event{}
	result := initializers.DB.Find(&event)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No items"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"event": event,
	})
}

func GetEventFromID(c *gin.Context) {
	id := c.Param("id")
	event := models.Event{}

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
	}

	result := initializers.DB.First(&event, id)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No items"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"event": event,
	})
}

func UpdateEventByID(c *gin.Context) {
	// Fetch the ID then try to retrieve the data from DB
	id := c.Param("id")
	event := models.Event{}

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
	}

	result := initializers.DB.First(&event, id)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No items"})
		return
	}

	// Bind the data to the struct, then attempt to insert to DB

	type eventUpdate struct {
		UpdatedAt   time.Time `json:"created_at"`
		Name        string    `json:"name"`
		Description string    `json:"description"`
		Location    string    `json:"location"`
		TimeStart   time.Time `json:"time_start"`
	}

	updatedEventDetails := eventUpdate{}
	if err := c.BindJSON(&updatedEventDetails); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
	}

	c.JSON(http.StatusOK, gin.H{
		"event": event,
	})
}

func DeleteEventByIDSoft(c *gin.Context) {
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
	}

	result := initializers.DB.Delete(&models.Event{}, id)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error})
		return
	}

	c.Status(http.StatusOK)
}

func TestPing(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}
