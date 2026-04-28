package postgres

import (
	"database/sql"

	"github.com/adk-saugat/snapstudy/server/internals/core/domain"
)

type LectureChapterStore struct {
	db *sql.DB
}

func NewLectureChapterStore(db *sql.DB) *LectureChapterStore {
	return &LectureChapterStore{db: db}
}

func (s *LectureChapterStore) GetNextChapterPosition(lectureID string) (int, error) {
	query := `
		SELECT COALESCE(MAX(position), 0) + 1
		FROM lecture_chapters
		WHERE lecture_id = $1
	`
	var next int
	if err := s.db.QueryRow(query, lectureID).Scan(&next); err != nil {
		return 0, err
	}
	return next, nil
}

func (s *LectureChapterStore) CreateLectureChapter(chapter domain.LectureChapter) (*domain.LectureChapter, error) {
	query := `
		INSERT INTO lecture_chapters (lecture_id, title, markdown, position)
		VALUES ($1, $2, $3, $4)
		RETURNING id, lecture_id, title, markdown, position, created_at, updated_at
	`

	var created domain.LectureChapter
	if err := s.db.QueryRow(query, chapter.LectureID, chapter.Title, chapter.Markdown, chapter.Position).Scan(
		&created.ID,
		&created.LectureID,
		&created.Title,
		&created.Markdown,
		&created.Position,
		&created.CreatedAt,
		&created.UpdatedAt,
	); err != nil {
		return nil, err
	}
	return &created, nil
}
