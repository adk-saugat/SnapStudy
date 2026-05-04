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
	ID        string `json:"id"`
	Name      string `json:"name"`
	Type      string `json:"type"`
	SizeBytes int64  `json:"size_bytes"`
}

type LectureChapterListItem struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Markdown string `json:"markdown"`
	Position int    `json:"position"`
}

type UploadLectureFileResponse struct {
	ObjectKey     string `json:"object_key"`
	ExtractedText string `json:"extracted_text"`
}

type LectureService interface {
	CreateLecture(lecture CreateLectureInput) (*CreateLectureResponse, error)
	ListUserLectures(userID string) ([]CreateLectureResponse, error)
	UpdateLecture(lecture UpdateLectureInput) (*CreateLectureResponse, error)
	DeleteLecture(userID, lectureID string) error
	UploadLectureFile(ctx context.Context, userID, lectureID, filename string, sizeBytes int64, body io.Reader, contentType string) (*UploadLectureFileResponse, error)
	ListLectureFiles(ctx context.Context, userID, lectureID string) ([]LectureFileListItem, error)
	ListLectureChapters(ctx context.Context, userID, lectureID string) ([]LectureChapterListItem, error)
	ExportLecturePDF(ctx context.Context, userID, lectureID string) (pdf []byte, filename string, err error)
	ExportChapterPDF(ctx context.Context, userID, lectureID, chapterID string) (pdf []byte, filename string, err error)
	DeleteLectureFile(ctx context.Context, userID, lectureID, fileID string) error
}
