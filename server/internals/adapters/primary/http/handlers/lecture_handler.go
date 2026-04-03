package handlers

import (
	"net/http"

	"github.com/adk-saugat/snapstudy/server/internals/core/ports/inbound"
	"github.com/gin-gonic/gin"
)

type LectureHandler struct {
	lectureService inbound.LectureService
}

func NewLectureHandler(lectureService inbound.LectureService) *LectureHandler {
	return &LectureHandler{lectureService: lectureService}
}

func (handler *LectureHandler) CreateLecture(context *gin.Context) {
	userId := context.GetString("userId")
	var lecture inbound.CreateLectureInput
	lecture.UserID = userId
	err := context.ShouldBindJSON(&lecture)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	lectureResponse, err := handler.lectureService.CreateLecture(lecture)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusCreated, gin.H{
		"message": "Lecture created successfully",
		"lecture": lectureResponse,
	})
}

func (handler *LectureHandler) ListUserLectures(context *gin.Context) {
	userId := context.GetString("userId")

	lectures, err := handler.lectureService.ListUserLectures(userId)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"lectures": lectures,
	})
}

func (handler *LectureHandler) UpdateLecture(context *gin.Context) {
	userID := context.GetString("userId")

	var requestBody struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description,omitempty"`
	}
	err := context.ShouldBindJSON(&requestBody)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updateInput := inbound.UpdateLectureInput{
		UserID:      userID,
		LectureID:   context.Param("lectureId"),
		Title:       requestBody.Title,
		Description: requestBody.Description,
	}

	updatedLecture, err := handler.lectureService.UpdateLecture(updateInput)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"message": "Lecture updated successfully",
		"lecture": updatedLecture,
	})
}

func (handler *LectureHandler) DeleteLecture(context *gin.Context) {
	userID := context.GetString("userId")
	lectureID := context.Param("lectureId")

	err := handler.lectureService.DeleteLecture(userID, lectureID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"message": "Lecture deleted successfully",
	})
}
