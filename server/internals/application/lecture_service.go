package application

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"log"
	"path/filepath"

	"github.com/adk-saugat/snapstudy/server/internals/core/domain"
	"github.com/adk-saugat/snapstudy/server/internals/core/ports/inbound"
	outbound "github.com/adk-saugat/snapstudy/server/internals/core/ports/outbound/postgres"
	"github.com/adk-saugat/snapstudy/server/internals/core/ports/outbound/storage"
	outboundTextract "github.com/adk-saugat/snapstudy/server/internals/core/ports/outbound/textract"
)

var ErrLectureNotFound = errors.New("lecture not found")
var ErrLectureFileNotFound = errors.New("lecture file not found")

type LectureService struct {
	lectureRepository     outbound.LectureRepository
	lectureFileRepository outbound.LectureFileRepository
	objectStorage         storage.ObjectStorage
	textExtractor         outboundTextract.DocumentTextExtractor
	storageBucket         string
}

func NewLectureService(
	lectureRepository outbound.LectureRepository,
	lectureFileRepository outbound.LectureFileRepository,
	objectStorage storage.ObjectStorage,
	textExtractor outboundTextract.DocumentTextExtractor,
	storageBucket string,
) *LectureService {
	return &LectureService{
		lectureRepository:     lectureRepository,
		lectureFileRepository: lectureFileRepository,
		objectStorage:         objectStorage,
		textExtractor:         textExtractor,
		storageBucket:         storageBucket,
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

func (s *LectureService) UploadLectureFile(ctx context.Context, userID, lectureID, filename string, sizeBytes int64, body io.Reader, contentType string) (*inbound.UploadLectureFileResponse, error) {
	lectures, err := s.lectureRepository.ListUserLectures(userID)
	if err != nil {
		return nil, err
	}
	var owns bool
	for _, l := range lectures {
		if l.ID == lectureID {
			owns = true
			break
		}
	}
	if !owns {
		return nil, ErrLectureNotFound
	}

	safeName := filepath.Base(filename)
	if safeName == "" || safeName == "." {
		safeName = "upload"
	}
	rnd := make([]byte, 8)
	if _, err := rand.Read(rnd); err != nil {
		return nil, err
	}
	key := fmt.Sprintf("lectures/%s/%s-%s", lectureID, hex.EncodeToString(rnd), safeName)

	if err := s.objectStorage.Put(ctx, key, body, contentType); err != nil {
		return nil, err
	}

	_, err = s.lectureFileRepository.CreateLectureFile(domain.LectureFile{
		LectureID: lectureID,
		Name:      safeName,
		Type:      contentType,
		SizeBytes: sizeBytes,
		URL:       key,
	})
	if err != nil {
		return nil, err
	}

	extractedText := ""
	if s.textExtractor != nil && s.storageBucket != "" {
		result, err := s.textExtractor.Extract(ctx, s.storageBucket, key, contentType)
		if err != nil {
			log.Printf("Textract OCR failed for lecture=%s key=%s: %v", lectureID, key, err)
		} else {
			extractedText = result.Text
			log.Printf("Textract OCR for lecture=%s key=%s lines=%d\n%s", lectureID, key, result.LineCount, extractedText)
		}
	} else {
		log.Printf("Textract OCR skipped for lecture=%s key=%s (extractor or bucket not configured)", lectureID, key)
	}

	return &inbound.UploadLectureFileResponse{
		ObjectKey:     key,
		ExtractedText: extractedText,
	}, nil
}

func (s *LectureService) ListLectureFiles(ctx context.Context, userID, lectureID string) ([]inbound.LectureFileListItem, error) {
	files, err := s.lectureFileRepository.ListLectureFiles(userID, lectureID)
	if err != nil {
		return nil, err
	}
	items := make([]inbound.LectureFileListItem, 0, len(files))
	for _, f := range files {
		items = append(items, inbound.LectureFileListItem{
			ID:        f.ID,
			Name:      f.Name,
			Type:      f.Type,
			SizeBytes: f.SizeBytes,
		})
	}
	return items, nil
}

func (s *LectureService) DeleteLectureFile(ctx context.Context, userID, lectureID, fileID string) error {
	file, err := s.lectureFileRepository.GetLectureFile(userID, lectureID, fileID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrLectureFileNotFound
		}
		return err
	}

	if err := s.objectStorage.Delete(ctx, file.URL); err != nil {
		return err
	}

	if err := s.lectureFileRepository.DeleteLectureFile(userID, lectureID, fileID); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrLectureFileNotFound
		}
		return err
	}
	return nil
}
