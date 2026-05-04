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
		SELECT id, user_id, title, COALESCE(description, ''), created_at, updated_at
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

func (s *LectureStore) GetUserLecture(userID, lectureID string) (*domain.Lecture, error) {
	query := `
		SELECT id, user_id, title, COALESCE(description, ''), created_at, updated_at
		FROM lectures
		WHERE id = $1 AND user_id = $2
	`

	var lecture domain.Lecture
	err := s.db.QueryRow(query, lectureID, userID).Scan(
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
	return &lecture, nil
}

func (s *LectureStore) UpdateLecture(lecture domain.Lecture) (*domain.Lecture, error) {
	query := `
		UPDATE lectures
		SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP
		WHERE id = $3 AND user_id = $4
		RETURNING id, user_id, title, COALESCE(description, ''), created_at, updated_at
	`

	var updatedLecture domain.Lecture
	err := s.db.QueryRow(query, lecture.Title, lecture.Description, lecture.ID, lecture.UserID).Scan(
		&updatedLecture.ID,
		&updatedLecture.UserID,
		&updatedLecture.Title,
		&updatedLecture.Description,
		&updatedLecture.CreatedAt,
		&updatedLecture.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &updatedLecture, nil
}

func (s *LectureStore) DeleteLecture(userID, lectureID string) error {
	query := `
		DELETE FROM lectures
		WHERE id = $1 AND user_id = $2
		RETURNING id
	`

	var deletedLectureID string
	err := s.db.QueryRow(query, lectureID, userID).Scan(&deletedLectureID)
	if err != nil {
		return err
	}

	return nil
}
