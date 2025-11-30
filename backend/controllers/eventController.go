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

// Creation
func CreateEvent(c *gin.Context) {
	// Retrieve the user information from context
	u, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized access",
		})
		return
	}

	user, ok := u.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot obtain user form context",
		})
		return
	}

	// Bind the data then insert to database
	var event struct {
		Name           string    `json:"name" binding:"required"`
		Description    string    `json:"description" binding:"required"`
		Location       string    `json:"location" binding:"required"`
		BannerFileName string    `json:"banner_file_name" binding:"required"`
		TimeStart      time.Time `json:"time_start" binding:"required"`
		TimeEnd        time.Time `json:"time_end" binding:"required"`
	}

	if err := c.BindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	// Generate new banner filename with UUID
	fNameSlice := strings.Split(event.BannerFileName, ".")

	fmt.Println("Filetype:", fNameSlice[len(fNameSlice)-1])

	approvedFormats := []string{"jpg", "jpeg", "png", "webp"}

	if !slices.Contains(approvedFormats, fNameSlice[len(fNameSlice)-1]) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid file type",
		})
		return
	}

	newFilename := fmt.Sprintf("%s.%s", uuid.New().String(), fNameSlice[len(fNameSlice)-1])

	event.BannerFileName = newFilename

	// Create database entry, then associate it with the user that inserted them
	newEvent := models.Event{
		Name:           event.Name,
		Description:    event.Description,
		Location:       event.Location,
		BannerFileName: event.BannerFileName,
		TimeStart:      event.TimeStart,
		TimeEnd:        event.TimeEnd,
	}

	err := initializers.DB.Model(&user).Association("Events").Append(&newEvent)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
	}

	// Return ID for uploading images UploadEventImage
	c.JSON(http.StatusOK, gin.H{"id": newEvent.ID})
}

func UploadEventImage(c *gin.Context) {
	// Check if the event exists
	id := c.Param("id")
	event := models.Event{}

	result := initializers.DB.First(&event, id)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Event doesn't exist",
		})
		return
	}

	// Receive the Image from the client
	file, err := c.FormFile("file")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	// Save the uploaded file
	c.SaveUploadedFile(file, "./public/events/banner/"+event.BannerFileName)

	c.JSON(http.StatusOK, gin.H{"status": fmt.Sprintf("'%s' uploaded!", file.Filename)})
}

func BookEvent(c *gin.Context) {
	// Retrieve the user information from context
	u, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized access",
		})
		return
	}

	user, ok := u.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot obtain user form context",
		})
		return
	}

	// Retrieve event
	id := c.Param("id")
	event := []models.Event{}
	result := initializers.DB.First(&event, id)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No items",
		})
		return
	}

	// Associate the event with the user
	err := initializers.DB.Model(&user).Association("BookedEvents").Append(&event)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	// Successful
	c.Status(http.StatusOK)

}

// Retrieve
func GetEventAll(c *gin.Context) {
	event := []models.Event{}
	result := initializers.DB.Find(&event)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No items",
		})
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

func GetEventCreatedByUser(c *gin.Context) {
	// Retrieve the user information from context
	u, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized access"})
		return
	}

	user, ok := u.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot obtain user form context"})
		return
	}

	// Retrieve the event created by the user
	event := []models.Event{}
	err := initializers.DB.Model(&user).Association("Events").Find(&event)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"event": event,
	})

}

func GetEventBookedByUser(c *gin.Context) {
	// Retrieve the user information from context
	u, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized access",
		})
		return
	}

	user, ok := u.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot obtain user form context",
		})
		return
	}

	// Retrieve the event booked by the user
	event := []models.Event{}
	err := initializers.DB.Model(&user).Association("BookedEvents").Find(&event)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"event": event,
	})

}

// Update/Delete
func UpdateEventByID(c *gin.Context) {
	// Fetch the ID then try to retrieve the data from DB
	id := c.Param("id")
	event := models.Event{}

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ID",
		})
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
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
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
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ID",
		})
		return
	}

	result := initializers.DB.Delete(&models.Event{}, id)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": result.Error,
		})
		return
	}

	c.Status(http.StatusNoContent)
}

func TestPing(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}
