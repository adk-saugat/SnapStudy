package outbound

import "github.com/adk-saugat/snapstudy/server/internals/core/domain"

type LectureChapterRepository interface {
	CreateLectureChapter(chapter domain.LectureChapter) (*domain.LectureChapter, error)
	GetNextChapterPosition(lectureID string) (int, error)
	ListLectureChapters(userID, lectureID string) ([]domain.LectureChapter, error)
	GetLectureChapter(userID, lectureID, chapterID string) (*domain.LectureChapter, error)
}
