package application

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"path/filepath"

	"github.com/adk-saugat/snapstudy/server/internals/core/domain"
	"github.com/adk-saugat/snapstudy/server/internals/core/ports/inbound"
	outbound "github.com/adk-saugat/snapstudy/server/internals/core/ports/outbound/postgres"
	"github.com/adk-saugat/snapstudy/server/internals/core/ports/outbound/storage"
)

var ErrLectureNotFound = errors.New("lecture not found")

type LectureService struct {
	lectureRepository     outbound.LectureRepository
	lectureFileRepository outbound.LectureFileRepository
	objectStorage         storage.ObjectStorage
}

func NewLectureService(
	lectureRepository outbound.LectureRepository,
	lectureFileRepository outbound.LectureFileRepository,
	objectStorage storage.ObjectStorage,
) *LectureService {
	return &LectureService{
		lectureRepository:     lectureRepository,
		lectureFileRepository: lectureFileRepository,
		objectStorage:         objectStorage,
	}
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

func (s *LectureService) UpdateLecture(lecture inbound.UpdateLectureInput) (*inbound.CreateLectureResponse, error) {
	lectureDomain := domain.Lecture{
		ID:          lecture.LectureID,
		UserID:      lecture.UserID,
		Title:       lecture.Title,
		Description: lecture.Description,
	}

	updatedLecture, err := s.lectureRepository.UpdateLecture(lectureDomain)
	if err != nil {
		return nil, err
	}

	return &inbound.CreateLectureResponse{
		ID:          updatedLecture.ID,
		Title:       updatedLecture.Title,
		Description: updatedLecture.Description,
		CreatedAt:   updatedLecture.CreatedAt,
		UpdatedAt:   updatedLecture.UpdatedAt,
	}, nil
}

func (s *LectureService) DeleteLecture(userID, lectureID string) error {
	err := s.lectureRepository.DeleteLecture(userID, lectureID)
	if err != nil {
		return err
	}

	return nil
}

func (s *LectureService) UploadLectureFile(ctx context.Context, userID, lectureID, filename string, sizeBytes int64, body io.Reader, contentType string) (string, error) {
	lectures, err := s.lectureRepository.ListUserLectures(userID)
	if err != nil {
		return "", err
	}
	var owns bool
	for _, l := range lectures {
		if l.ID == lectureID {
			owns = true
			break
		}
	}
	if !owns {
		return "", ErrLectureNotFound
	}

	safeName := filepath.Base(filename)
	if safeName == "" || safeName == "." {
		safeName = "upload"
	}
	rnd := make([]byte, 8)
	if _, err := rand.Read(rnd); err != nil {
		return "", err
	}
	key := fmt.Sprintf("lectures/%s/%s-%s", lectureID, hex.EncodeToString(rnd), safeName)

	if err := s.objectStorage.Put(ctx, key, body, contentType); err != nil {
		return "", err
	}

	_, err = s.lectureFileRepository.CreateLectureFile(domain.LectureFile{
		LectureID: lectureID,
		Name:      safeName,
		Type:      contentType,
		SizeBytes: sizeBytes,
		URL:       key,
	})
	if err != nil {
		return "", err
	}
	return key, nil
}

func (s *LectureService) ListLectureFiles(ctx context.Context, userID, lectureID string) ([]inbound.LectureFileListItem, error) {
	files, err := s.lectureFileRepository.ListLectureFiles(userID, lectureID)
	if err != nil {
		return nil, err
	}
	items := make([]inbound.LectureFileListItem, 0, len(files))
	for _, f := range files {
		items = append(items, inbound.LectureFileListItem{
			Name:      f.Name,
			Type:      f.Type,
			SizeBytes: f.SizeBytes,
		})
	}
	return items, nil
}
