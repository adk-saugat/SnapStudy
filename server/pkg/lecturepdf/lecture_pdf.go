package lecturepdf

import (
	"strings"

	"github.com/adk-saugat/snapstudy/server/pkg/pdfdoc"
)

// ChapterSection is one chapter block in the exported PDF.
type ChapterSection struct {
	Title string
	Body  string
}

const (
	bodyFontPt   = 11
	bodyLineHtMm = 6.0
)

// BuildLecturePDF renders lecture title and chapter sections into a PDF document.
func BuildLecturePDF(lectureTitle string, chapters []ChapterSection) ([]byte, error) {
	doc := pdfdoc.NewA4()
	doc.PDF.AddPage()

	title := strings.TrimSpace(lectureTitle)
	if title == "" {
		title = "Lecture"
	}
	doc.WriteLectureCoverTitle(title)

	for i, ch := range chapters {
		if i > 0 {
			doc.PDF.Ln(4)
		}
		chTitle := strings.TrimSpace(ch.Title)
		if chTitle == "" {
			chTitle = "Chapter"
		}
		doc.WriteSectionBand(chTitle)

		if err := renderMarkdownBody(doc, ch.Body, bodyFontPt, bodyLineHtMm); err != nil {
			return nil, err
		}
		doc.PDF.Ln(6)
	}

	return doc.Output()
}

// BuildChapterPDF renders a single chapter (title + markdown body) into one PDF document.
func BuildChapterPDF(chapterTitle, markdown string) ([]byte, error) {
	doc := pdfdoc.NewA4()
	doc.PDF.AddPage()

	title := strings.TrimSpace(chapterTitle)
	if title == "" {
		title = "Chapter"
	}
	doc.WriteChapterCoverTitle(title)

	if err := renderMarkdownBody(doc, markdown, bodyFontPt, bodyLineHtMm); err != nil {
		return nil, err
	}

	return doc.Output()
}
