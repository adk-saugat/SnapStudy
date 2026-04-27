package postgres

import (
	"database/sql"
	"errors"

	"github.com/adk-saugat/snapstudy/server/internals/core/domain"
)

type LectureFileStore struct {
	db *sql.DB
}

func NewLectureFileStore(db *sql.DB) *LectureFileStore {
	return &LectureFileStore{db: db}
}

func (s *LectureFileStore) CreateLectureFile(file domain.LectureFile) (*domain.LectureFile, error) {
	query := `
		INSERT INTO lecture_files (lecture_id, name, type, size_bytes, url)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, lecture_id, name, type, size_bytes, url, uploaded_at
	`

	var created domain.LectureFile
	err := s.db.QueryRow(
		query,
		file.LectureID,
		file.Name,
		file.Type,
		file.SizeBytes,
		file.URL,
	).Scan(
		&created.ID,
		&created.LectureID,
		&created.Name,
		&created.Type,
		&created.SizeBytes,
		&created.URL,
		&created.UploadedAt,
	)
	if err != nil {
		return nil, err
	}
	return &created, nil
}

func (s *LectureFileStore) ListLectureFiles(userID, lectureID string) ([]domain.LectureFile, error) {
	query := `
		SELECT lf.id, lf.lecture_id, lf.name, lf.type, lf.size_bytes, lf.url, lf.uploaded_at
		FROM lecture_files lf
		INNER JOIN lectures l ON l.id = lf.lecture_id
		WHERE l.user_id = $1 AND lf.lecture_id = $2
		ORDER BY lf.uploaded_at DESC
	`

	rows, err := s.db.Query(query, userID, lectureID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	files := make([]domain.LectureFile, 0)
	for rows.Next() {
		var f domain.LectureFile
		if err := rows.Scan(
			&f.ID,
			&f.LectureID,
			&f.Name,
			&f.Type,
			&f.SizeBytes,
			&f.URL,
			&f.UploadedAt,
		); err != nil {
			return nil, err
		}
		files = append(files, f)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return files, nil
}

func (s *LectureFileStore) GetLectureFile(userID, lectureID, fileID string) (*domain.LectureFile, error) {
	query := `
		SELECT lf.id, lf.lecture_id, lf.name, lf.type, lf.size_bytes, lf.url, lf.uploaded_at
		FROM lecture_files lf
		INNER JOIN lectures l ON l.id = lf.lecture_id
		WHERE l.user_id = $1 AND lf.lecture_id = $2 AND lf.id = $3
	`

	var f domain.LectureFile
	err := s.db.QueryRow(query, userID, lectureID, fileID).Scan(
		&f.ID,
		&f.LectureID,
		&f.Name,
		&f.Type,
		&f.SizeBytes,
		&f.URL,
		&f.UploadedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}
	return &f, nil
}

func (s *LectureFileStore) DeleteLectureFile(userID, lectureID, fileID string) error {
	query := `
		DELETE FROM lecture_files lf
		USING lectures l
		WHERE lf.lecture_id = l.id
			AND l.user_id = $1
			AND lf.lecture_id = $2
			AND lf.id = $3
	`

	result, err := s.db.Exec(query, userID, lectureID, fileID)
	if err != nil {
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}
	return nil
}
