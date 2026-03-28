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

func (s *LectureStore) ListUserLectures(userID string) ([]domain.Lecture, error) {
	query := `
		SELECT id, user_id, title, description, created_at, updated_at
		FROM lectures
		WHERE user_id = $1
		ORDER BY created_at DESC
	`

	rows, err := s.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	lectures := make([]domain.Lecture, 0)
	for rows.Next() {
		var lecture domain.Lecture
		err = rows.Scan(
			&lecture.ID,
			&lecture.UserID,
			&lecture.Title,
			&lecture.Description,
			&lecture.CreatedAt,
			&lecture.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		lectures = append(lectures, lecture)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return lectures, nil
}