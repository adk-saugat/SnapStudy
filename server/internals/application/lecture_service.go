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

func (s *LectureService) ListUserLectures(userID string) ([]inbound.CreateLectureResponse, error) {
	lectures, err := s.lectureRepository.ListUserLectures(userID)
	if err != nil {
		return nil, err
	}

	responses := make([]inbound.CreateLectureResponse, 0, len(lectures))
	for _, lecture := range lectures {
		responses = append(responses, inbound.CreateLectureResponse{
			ID:          lecture.ID,
			Title:       lecture.Title,
			Description: lecture.Description,
			CreatedAt:   lecture.CreatedAt,
			UpdatedAt:   lecture.UpdatedAt,
		})
	}

	return responses, nil
}
