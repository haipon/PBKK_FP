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
