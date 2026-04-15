package domain

import "time"

type LectureFile struct {
	ID         string    `json:"id"`
	LectureID  string    `json:"lecture_id"`
	Name       string    `json:"name"`
	Type       string    `json:"type"`
	SizeBytes  int64     `json:"size_bytes"`
	URL        string    `json:"url"`
	UploadedAt time.Time `json:"uploaded_at"`
}

