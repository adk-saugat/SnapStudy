package postgres

import (
	"database/sql"

	"github.com/adk-saugat/snapstudy/server/internals/core/domain"
)

type LectureStore struct {
	db *sql.DB
}

func NewLectureStore(db *sql.DB) *LectureStore {
	return &LectureStore{db: db}
}

func (s *LectureStore) CreateLecture(lecture domain.Lecture) (*domain.Lecture, error) {
	query := `
		INSERT INTO lectures (user_id, title, description, created_at)
		VALUES ($1, $2, $3, $4) RETURNING id
	`
	err := s.db.QueryRow(query, lecture.UserID, lecture.Title, lecture.Description, lecture.CreatedAt).Scan(&lecture.ID)
	if err != nil {
		return nil, err
	}
	return &lecture, nil
}