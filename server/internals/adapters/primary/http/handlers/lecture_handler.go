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
