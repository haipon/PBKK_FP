package models

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	Name           string
	Description    string
	Location       string
	BannerFileName string
	TimeStart      time.Time
	TimeEnd        time.Time
	UserID         uint
	BookedBy       []*User `gorm:"many2many:user_events;" json:"-"`
}
