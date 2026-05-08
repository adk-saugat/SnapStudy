package pdfdoc

import "github.com/go-pdf/fpdf"

// Theme holds RGB palette and typography tokens for styled PDFs.
type Theme struct {
	DocumentTitleR, DocumentTitleG, DocumentTitleB int
	AccentRuleR, AccentRuleG, AccentRuleB          int

	BodyR, BodyG, BodyB int

	HeadingR, HeadingG, HeadingB             int
	HeadingRuleR, HeadingRuleG, HeadingRuleB int

	ListMarkerR, ListMarkerG, ListMarkerB int

	CodeFillR, CodeFillG, CodeFillB       int
	CodeBorderR, CodeBorderG, CodeBorderB int
	CodeTextR, CodeTextG, CodeTextB       int

	SectionFillR, SectionFillG, SectionFillB       int
	SectionBorderR, SectionBorderG, SectionBorderB int

	ThematicR, ThematicG, ThematicB int
}

// SnapStudy matches the lecture UI orange / warm neutrals.
var SnapStudy = Theme{
	DocumentTitleR: 67, DocumentTitleG: 20, DocumentTitleB: 7,
	AccentRuleR: 234, AccentRuleG: 88, AccentRuleB: 12,

	BodyR: 40, BodyG: 40, BodyB: 42,

	HeadingR: 28, HeadingG: 25, HeadingB: 23,
	HeadingRuleR: 251, HeadingRuleG: 146, HeadingRuleB: 60,

	ListMarkerR: 120, ListMarkerG: 53, ListMarkerB: 15,

	CodeFillR: 255, CodeFillG: 247, CodeFillB: 237,
	CodeBorderR: 253, CodeBorderG: 186, CodeBorderB: 116,
	CodeTextR: 55, CodeTextG: 48, CodeTextB: 40,

	SectionFillR: 255, SectionFillG: 237, SectionFillB: 213,
	SectionBorderR: 251, SectionBorderG: 146, SectionBorderB: 60,

	ThematicR: 200, ThematicG: 200, ThematicB: 200,
}

func (t Theme) setTextRGB(pdf *fpdf.Fpdf, r, g, b int) {
	pdf.SetTextColor(r, g, b)
}

// SetBodyText sets default body ink.
func (t Theme) SetBodyText(pdf *fpdf.Fpdf) {
	t.setTextRGB(pdf, t.BodyR, t.BodyG, t.BodyB)
}

// SetDocumentTitleText sets the large cover title color.
func (t Theme) SetDocumentTitleText(pdf *fpdf.Fpdf) {
	t.setTextRGB(pdf, t.DocumentTitleR, t.DocumentTitleG, t.DocumentTitleB)
}

// SetHeadingInk sets ATX heading text color.
func (t Theme) SetHeadingInk(pdf *fpdf.Fpdf) {
	t.setTextRGB(pdf, t.HeadingR, t.HeadingG, t.HeadingB)
}

// SetListMarkerInk sets list bullet / number color.
func (t Theme) SetListMarkerInk(pdf *fpdf.Fpdf) {
	t.setTextRGB(pdf, t.ListMarkerR, t.ListMarkerG, t.ListMarkerB)
}

// SetCodeText sets monospace block text color.
func (t Theme) SetCodeText(pdf *fpdf.Fpdf) {
	t.setTextRGB(pdf, t.CodeTextR, t.CodeTextG, t.CodeTextB)
}

// ResetDraw resets stroke to a neutral default.
func (t Theme) ResetDraw(pdf *fpdf.Fpdf) {
	pdf.SetDrawColor(0, 0, 0)
	pdf.SetLineWidth(0.2)
}

// SetAccentRuleStroke draws the main title underline.
func (t Theme) SetAccentRuleStroke(pdf *fpdf.Fpdf, lineWidth float64) {
	pdf.SetDrawColor(t.AccentRuleR, t.AccentRuleG, t.AccentRuleB)
	pdf.SetLineWidth(lineWidth)
}

// SetHeadingRuleStroke draws the rule under markdown headings.
func (t Theme) SetHeadingRuleStroke(pdf *fpdf.Fpdf, lineWidth float64) {
	pdf.SetDrawColor(t.HeadingRuleR, t.HeadingRuleG, t.HeadingRuleB)
	pdf.SetLineWidth(lineWidth)
}

// SetThematicBreakStroke draws horizontal rules.
func (t Theme) SetThematicBreakStroke(pdf *fpdf.Fpdf, lineWidth float64) {
	pdf.SetDrawColor(t.ThematicR, t.ThematicG, t.ThematicB)
	pdf.SetLineWidth(lineWidth)
}
