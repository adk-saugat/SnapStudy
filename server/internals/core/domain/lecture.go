package domain

import "time"

type Lecture struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id" binding:"required"`
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func NewLecture(userID, title, description string) *Lecture {
	now := time.Now()
	return &Lecture{
		UserID:      userID,
		Title:       title,
		Description: description,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

type LectureFile struct {
	ID         string    `json:"id"`
	LectureID  string    `json:"lecture_id" binding:"required"`
	Name       string    `json:"name" binding:"required"`
	Type       string    `json:"type" binding:"required"`
	SizeBytes  int64     `json:"size_bytes" binding:"required"`
	URL        string    `json:"url" binding:"required"`
	UploadedAt time.Time `json:"uploaded_at"`
}

type LectureChapter struct {
	ID        string    `json:"id"`
	LectureID string    `json:"lecture_id" binding:"required"`
	Title     string    `json:"title" binding:"required"`
	Markdown  string    `json:"markdown" binding:"required"`
	Position  int       `json:"position" binding:"required"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
