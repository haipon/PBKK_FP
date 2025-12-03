package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name         string `gorm:"unique"`
	Email        string `gorm:"unique"`
	Password     string
	Events       []Event
	BookedEvents []*Event `gorm:"many2many:user_events;" json:"-"`
}

type UserResponse struct {
	ID    uint   `json:"ID"`
	Name  string `json:"Name"`
	Email string `json:"Email"`
}

func (u User) ToResponse() UserResponse {
	return UserResponse{
		ID:    u.ID,
		Name:  u.Name,
		Email: u.Email,
	}
}
