package lecturepdf

import (
	"bytes"
	htmlpkg "html"
	"regexp"
	"strings"
	"unicode"

	"github.com/go-pdf/fpdf"
	"github.com/yuin/goldmark"
	gmhtml "github.com/yuin/goldmark/renderer/html"
)

var goldmarkEngine = goldmark.New(
	goldmark.WithRendererOptions(
		gmhtml.WithHardWraps(),
	),
)

var tagPattern = regexp.MustCompile(`<[^>]+>`)

// ChapterSection is one chapter block in the exported PDF.
type ChapterSection struct {
	Title string
	Body  string
}

func markdownToPlain(markdown string) string {
	var buf bytes.Buffer
	if err := goldmarkEngine.Convert([]byte(markdown), &buf); err != nil {
		return markdown
	}
	h := buf.String()
	h = strings.ReplaceAll(h, "<br>", "\n")
	h = strings.ReplaceAll(h, "<br/>", "\n")
	h = strings.ReplaceAll(h, "<br />", "\n")
	h = strings.ReplaceAll(h, "</p>", "\n")
	h = strings.ReplaceAll(h, "</h1>", "\n")
	h = strings.ReplaceAll(h, "</h2>", "\n")
	h = strings.ReplaceAll(h, "</h3>", "\n")
	h = strings.ReplaceAll(h, "</li>", "\n")
	h = strings.ReplaceAll(h, "<li>", "- ")
	h = tagPattern.ReplaceAllString(h, "")
	h = htmlpkg.UnescapeString(h)
	lines := strings.Split(h, "\n")
	for i := range lines {
		lines[i] = strings.TrimSpace(lines[i])
	}
	return strings.TrimSpace(strings.Join(lines, "\n"))
}

func toPrintableASCII(s string) string {
	var b strings.Builder
	for _, r := range s {
		switch {
		case r == '\n' || r == '\r' || r == '\t':
			b.WriteRune(r)
		case r >= 32 && r <= 126:
			b.WriteRune(r)
		default:
			if unicode.IsSpace(r) {
				b.WriteRune(' ')
			} else {
				b.WriteRune('?')
			}
		}
	}
	return b.String()
}

// BuildLecturePDF renders lecture title and chapter sections into a PDF document.
func BuildLecturePDF(lectureTitle string, chapters []ChapterSection) ([]byte, error) {
	pdf := fpdf.New("P", "mm", "A4", "")
	pdf.SetMargins(12, 12, 12)
	pdf.SetAutoPageBreak(true, 14)
	pdf.AddPage()
	pdf.SetTitle(toPrintableASCII(lectureTitle), false)

	pdf.SetFont("Arial", "B", 16)
	title := toPrintableASCII(strings.TrimSpace(lectureTitle))
	if title == "" {
		title = "Lecture"
	}
	pdf.MultiCell(0, 8, title, "", "L", false)
	pdf.Ln(4)

	pdf.SetFont("Arial", "", 11)
	for _, ch := range chapters {
		chTitle := toPrintableASCII(strings.TrimSpace(ch.Title))
		if chTitle == "" {
			chTitle = "Chapter"
		}
		pdf.SetFont("Arial", "B", 13)
		pdf.MultiCell(0, 7, chTitle, "", "L", false)
		pdf.Ln(1)

		body := toPrintableASCII(markdownToPlain(ch.Body))
		pdf.SetFont("Arial", "", 11)
		pdf.MultiCell(0, 5.5, body, "", "L", false)
		pdf.Ln(6)
	}

	var out bytes.Buffer
	if err := pdf.Output(&out); err != nil {
		return nil, err
	}
	return out.Bytes(), nil
}

// BuildChapterPDF renders a single chapter (title + markdown body) into one PDF document.
func BuildChapterPDF(chapterTitle, markdown string) ([]byte, error) {
	pdf := fpdf.New("P", "mm", "A4", "")
	pdf.SetMargins(12, 12, 12)
	pdf.SetAutoPageBreak(true, 14)
	pdf.AddPage()

	title := toPrintableASCII(strings.TrimSpace(chapterTitle))
	if title == "" {
		title = "Chapter"
	}
	pdf.SetTitle(title, false)

	pdf.SetFont("Arial", "B", 16)
	pdf.MultiCell(0, 8, title, "", "L", false)
	pdf.Ln(3)

	body := toPrintableASCII(markdownToPlain(markdown))
	pdf.SetFont("Arial", "", 11)
	pdf.MultiCell(0, 5.5, body, "", "L", false)

	var out bytes.Buffer
	if err := pdf.Output(&out); err != nil {
		return nil, err
	}
	return out.Bytes(), nil
}
