package models

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	Name           string    `json:"name"`
	Description    string    `json:"description"`
	Location       string    `json:"location"`
	BannerFileName string    `json:"banner_file_name"`
	TimeStart      time.Time `json:"time_start"`
	UserID         uint      `json:"-"`
	BookedBy       []*User   `gorm:"many2many:user_events;" json:"-"`
}
