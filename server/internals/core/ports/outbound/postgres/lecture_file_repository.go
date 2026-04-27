package outbound

import "github.com/adk-saugat/snapstudy/server/internals/core/domain"

type LectureFileRepository interface {
	CreateLectureFile(file domain.LectureFile) (*domain.LectureFile, error)
	ListLectureFiles(userID, lectureID string) ([]domain.LectureFile, error)
	GetLectureFile(userID, lectureID, fileID string) (*domain.LectureFile, error)
	DeleteLectureFile(userID, lectureID, fileID string) error
}
