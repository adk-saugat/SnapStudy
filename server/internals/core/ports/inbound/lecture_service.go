package inbound

import (
	"time"
)

type CreateLectureInput struct {
	UserID      string `json:"user_id" binding:"required"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description,omitempty"`
}

type UpdateLectureInput struct {
	UserID      string `json:"user_id" binding:"required"`
	LectureID   string `json:"lecture_id" binding:"required"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description,omitempty"`
}

type CreateLectureResponse struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type LectureService interface {
	CreateLecture(lecture CreateLectureInput) (*CreateLectureResponse, error)
	ListUserLectures(userID string) ([]CreateLectureResponse, error)
	UpdateLecture(lecture UpdateLectureInput) (*CreateLectureResponse, error)
	DeleteLecture(userID, lectureID string) error
}
