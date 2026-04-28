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
		INSERT INTO lecture_chapters (lecture_id, lecture_file_id, title, markdown, position)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, lecture_id, lecture_file_id, title, markdown, position, created_at, updated_at
	`

	var created domain.LectureChapter
	var lectureFileID sql.NullString
	if err := s.db.QueryRow(query, chapter.LectureID, chapter.LectureFileID, chapter.Title, chapter.Markdown, chapter.Position).Scan(
		&created.ID,
		&created.LectureID,
		&lectureFileID,
		&created.Title,
		&created.Markdown,
		&created.Position,
		&created.CreatedAt,
		&created.UpdatedAt,
	); err != nil {
		return nil, err
	}
	if lectureFileID.Valid {
		created.LectureFileID = &lectureFileID.String
	}
	return &created, nil
}

func (s *LectureChapterStore) ListLectureChapters(userID, lectureID string) ([]domain.LectureChapter, error) {
	query := `
		SELECT lc.id, lc.lecture_id, lc.lecture_file_id, lc.title, lc.markdown, lc.position, lc.created_at, lc.updated_at
		FROM lecture_chapters lc
		INNER JOIN lectures l ON l.id = lc.lecture_id
		WHERE l.user_id = $1 AND lc.lecture_id = $2
		ORDER BY lc.position ASC
	`

	rows, err := s.db.Query(query, userID, lectureID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	chapters := make([]domain.LectureChapter, 0)
	for rows.Next() {
		var chapter domain.LectureChapter
		var lectureFileID sql.NullString
		if err := rows.Scan(
			&chapter.ID,
			&chapter.LectureID,
			&lectureFileID,
			&chapter.Title,
			&chapter.Markdown,
			&chapter.Position,
			&chapter.CreatedAt,
			&chapter.UpdatedAt,
		); err != nil {
			return nil, err
		}
		if lectureFileID.Valid {
			chapter.LectureFileID = &lectureFileID.String
		}
		chapters = append(chapters, chapter)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	return chapters, nil
}
