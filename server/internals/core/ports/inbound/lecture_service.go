package inbound

import (
	"context"
	"io"
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

type LectureFileListItem struct {
	Name      string `json:"name"`
	Type      string `json:"type"`
	SizeBytes int64  `json:"size_bytes"`
}

type LectureService interface {
	CreateLecture(lecture CreateLectureInput) (*CreateLectureResponse, error)
	ListUserLectures(userID string) ([]CreateLectureResponse, error)
	UpdateLecture(lecture UpdateLectureInput) (*CreateLectureResponse, error)
	DeleteLecture(userID, lectureID string) error
	UploadLectureFile(ctx context.Context, userID, lectureID, filename string, sizeBytes int64, body io.Reader, contentType string) (objectKey string, err error)
	ListLectureFiles(ctx context.Context, userID, lectureID string) ([]LectureFileListItem, error)
}
