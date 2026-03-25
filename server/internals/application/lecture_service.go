package application

import (
	"github.com/adk-saugat/snapstudy/server/internals/core/domain"
	"github.com/adk-saugat/snapstudy/server/internals/core/ports/inbound"
	"github.com/adk-saugat/snapstudy/server/internals/core/ports/outbound"
)

type LectureService struct {
	lectureRepository outbound.LectureRepository
}

func NewLectureService(lectureRepository outbound.LectureRepository) *LectureService {
	return &LectureService{lectureRepository: lectureRepository}
}

func (s *LectureService) CreateLecture(lecture inbound.CreateLectureInput) (*inbound.CreateLectureResponse, error) {
	lectureDomain := domain.NewLecture(lecture.UserID, lecture.Title, lecture.Description)
	createdLecture, err := s.lectureRepository.CreateLecture(*lectureDomain)
	if err != nil {
		return nil, err
	}

	return &inbound.CreateLectureResponse{
		ID:          createdLecture.ID,
		Title:       createdLecture.Title,
		Description: createdLecture.Description,
		CreatedAt:   createdLecture.CreatedAt,
		UpdatedAt:   createdLecture.UpdatedAt,
	}, nil
}
