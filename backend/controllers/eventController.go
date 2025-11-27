package controllers

import (
	"evora/initializers"
	"evora/models"
	"fmt"
	"net/http"
	"slices"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func CreateEvent(c *gin.Context) {
	// Struct to bind JSON data with
	// Bind the data then insert to database
	newEvent := models.Event{}

	if err := c.BindJSON(&newEvent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
	}

	// Generate new banner filename with UUI
	fNameSlice := strings.Split(newEvent.BannerFileName, ".")

	fmt.Println("Filetype:", fNameSlice[len(fNameSlice)-1])

	approvedFormats := []string{"jpg", "jpeg", "png", "webp"}

	if !slices.Contains(approvedFormats, fNameSlice[len(fNameSlice)-1]) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type"})
		return
	}

	newFilename := fmt.Sprintf("%s.%s", uuid.New().String(), fNameSlice[len(fNameSlice)-1])

	newEvent.BannerFileName = newFilename

	results := initializers.DB.Create(&newEvent)

	if results.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": results.Error})
	}

	c.JSON(http.StatusCreated, newEvent)
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
		return
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
		return
	}

	result := initializers.DB.First(&event, id)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No items"})
		return
	}

	// Bind the data to the struct, then attempt to insert to DB

	type eventUpdate struct {
		Name        *string    `json:"name"`
		Description *string    `json:"description"`
		Location    *string    `json:"location"`
		TimeStart   *time.Time `json:"time_start"`
	}

	updatedEventDetails := eventUpdate{}
	if err := c.BindJSON(&updatedEventDetails); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if updatedEventDetails.Name != nil {
		event.Name = *updatedEventDetails.Name
	}

	if updatedEventDetails.Description != nil {
		event.Description = *updatedEventDetails.Description
	}

	if updatedEventDetails.Location != nil {
		event.Location = *updatedEventDetails.Location
	}

	if updatedEventDetails.TimeStart != nil {
		event.TimeStart = *updatedEventDetails.TimeStart
	}

	initializers.DB.Save(&event)

	c.JSON(http.StatusOK, gin.H{
		"event": event,
	})
}

func DeleteEventByIDSoft(c *gin.Context) {
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	result := initializers.DB.Delete(&models.Event{}, id)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error})
		return
	}

	c.Status(http.StatusNoContent)
}

func UploadEventImage(c *gin.Context) {
	// Check if the event exists
	id := c.Param("id")
	event := models.Event{}

	result := initializers.DB.First(&event, id)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Event doesn't exist"})
		return
	}

	// Receive the Image from the client
	file, err := c.FormFile("file")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	// Save the uploaded file
	c.SaveUploadedFile(file, "./public/events/banner/"+event.BannerFileName)

	c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
}

func TestPing(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}
