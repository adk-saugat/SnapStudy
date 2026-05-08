package pdfdoc

import (
	"bytes"
	"strings"

	"github.com/go-pdf/fpdf"
)

// Document wraps fpdf with SnapStudy margins and a shared theme.
type Document struct {
	PDF   *fpdf.Fpdf
	Theme Theme
}

// NewA4 creates a portrait A4 PDF with default margins and cell margin.
func NewA4() *Document {
	pdf := fpdf.New("P", "mm", "A4", "")
	pdf.SetMargins(18, 20, 18)
	pdf.SetAutoPageBreak(true, 18)
	pdf.SetCellMargin(0.6)
	return &Document{PDF: pdf, Theme: SnapStudy}
}

// WriteLectureCoverTitle renders the main lecture title and accent rule (large).
func (d *Document) WriteLectureCoverTitle(rawTitle string) {
	title := strings.TrimSpace(rawTitle)
	if title == "" {
		title = "Lecture"
	}
	title = ToPrintableASCII(title)
	d.PDF.SetTitle(title, false)

	d.Theme.SetDocumentTitleText(d.PDF)
	d.PDF.SetFont("Arial", "B", 22)
	d.PDF.MultiCell(0, 10, title, "", "L", false)
	d.PDF.Ln(2)

	d.Theme.SetAccentRuleStroke(d.PDF, 0.5)
	d.strokeFullWidthRule()
	d.PDF.Ln(8)

	d.Theme.SetBodyText(d.PDF)
	d.Theme.ResetDraw(d.PDF)
}

// WriteChapterCoverTitle renders a single-chapter document title and rule (medium).
func (d *Document) WriteChapterCoverTitle(rawTitle string) {
	title := strings.TrimSpace(rawTitle)
	if title == "" {
		title = "Chapter"
	}
	title = ToPrintableASCII(title)
	d.PDF.SetTitle(title, false)

	d.Theme.SetDocumentTitleText(d.PDF)
	d.PDF.SetFont("Arial", "B", 20)
	d.PDF.MultiCell(0, 9, title, "", "L", false)
	d.PDF.Ln(2)

	d.Theme.SetAccentRuleStroke(d.PDF, 0.45)
	d.strokeFullWidthRule()
	d.PDF.Ln(8)

	d.Theme.SetBodyText(d.PDF)
	d.Theme.ResetDraw(d.PDF)
}

// WriteSectionBand draws a full-width filled band for a section label (e.g. chapter name in a bundle PDF).
func (d *Document) WriteSectionBand(rawTitle string) {
	title := strings.TrimSpace(rawTitle)
	if title == "" {
		title = "Chapter"
	}
	title = ToPrintableASCII(title)

	d.PDF.SetFillColor(d.Theme.SectionFillR, d.Theme.SectionFillG, d.Theme.SectionFillB)
	d.PDF.SetDrawColor(d.Theme.SectionBorderR, d.Theme.SectionBorderG, d.Theme.SectionBorderB)
	d.PDF.SetFont("Arial", "B", 14)
	d.PDF.CellFormat(0, 9, "  "+title, "LTRB", 1, "L", true, 0, "")
	d.PDF.Ln(2)
	d.PDF.SetFont("Arial", "", 11)
	d.Theme.SetBodyText(d.PDF)
}

func (d *Document) strokeFullWidthRule() {
	pageW, _ := d.PDF.GetPageSize()
	lM, _, rM, _ := d.PDF.GetMargins()
	d.PDF.Line(lM, d.PDF.GetY(), pageW-rM, d.PDF.GetY())
}

// Output returns the PDF bytes.
func (d *Document) Output() ([]byte, error) {
	var buf bytes.Buffer
	if err := d.PDF.Output(&buf); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}
