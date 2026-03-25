package outbound

import "github.com/adk-saugat/snapstudy/server/internals/core/domain"

type LectureRepository interface {
	CreateLecture(lecture domain.Lecture) (*domain.Lecture, error)
}