package lecturepdf

import (
	"fmt"
	"strings"

	"github.com/adk-saugat/snapstudy/server/pkg/pdfdoc"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/text"
)

var markdownEngine = goldmark.New()

type listFrame struct {
	ordered bool
	next    int
}

type inlineStyle struct {
	bold   int
	italic int
}

type markdownRenderer struct {
	doc *pdfdoc.Document
	src []byte

	bodySize   float64
	lineHeight float64

	listStack       []listFrame
	listMarginStack []float64
	blockquoteNest  int
}

func parseMarkdownRoot(markdown string) ast.Node {
	return markdownEngine.Parser().Parse(text.NewReader([]byte(markdown)))
}

func (r *markdownRenderer) blockquoteShift() float64 {
	return float64(r.blockquoteNest) * 4
}

func (r *markdownRenderer) syncLeftMargin() {
	p := r.doc.PDF
	l, _, _, _ := p.GetMargins()
	if len(r.listMarginStack) > 0 {
		p.SetLeftMargin(r.listMarginStack[len(r.listMarginStack)-1])
		return
	}
	p.SetLeftMargin(l + r.blockquoteShift())
}

func (r *markdownRenderer) textX() float64 {
	p := r.doc.PDF
	l, _, _, _ := p.GetMargins()
	if len(r.listMarginStack) > 0 {
		return r.listMarginStack[len(r.listMarginStack)-1]
	}
	return l + r.blockquoteShift()
}

func (r *markdownRenderer) fontStyleFrom(st inlineStyle) string {
	b := st.bold > 0
	i := st.italic > 0
	switch {
	case b && i:
		return "BI"
	case b:
		return "B"
	case i:
		return "I"
	default:
		return ""
	}
}

func (r *markdownRenderer) renderInlines(parent ast.Node, lineHeight, fontSize float64, st inlineStyle) {
	p := r.doc.PDF
	for c := parent.FirstChild(); c != nil; c = c.NextSibling() {
		switch n := c.(type) {
		case *ast.Text:
			txt := pdfdoc.ToPrintableASCII(string(n.Value(r.src)))
			p.SetFont("Arial", r.fontStyleFrom(st), fontSize)
			switch {
			case n.HardLineBreak():
				p.Write(lineHeight, txt)
				p.Write(lineHeight, "\n")
			case n.SoftLineBreak():
				p.Write(lineHeight, txt+" ")
			default:
				p.Write(lineHeight, txt)
			}
		case *ast.Emphasis:
			st2 := st
			if n.Level == 2 {
				st2.bold++
			} else {
				st2.italic++
			}
			p.SetFont("Arial", r.fontStyleFrom(st2), fontSize)
			r.renderInlines(n, lineHeight, fontSize, st2)
			p.SetFont("Arial", r.fontStyleFrom(st), fontSize)
		case *ast.CodeSpan:
			p.SetFont("Courier", r.fontStyleFrom(st), fontSize-1)
			r.renderInlines(n, lineHeight-0.5, fontSize-1, st)
			p.SetFont("Arial", r.fontStyleFrom(st), fontSize)
		case *ast.Link:
			r.renderInlines(n, lineHeight, fontSize, st)
		case *ast.AutoLink:
			p.SetFont("Arial", r.fontStyleFrom(st), fontSize)
			p.Write(lineHeight, pdfdoc.ToPrintableASCII(string(n.Label(r.src))))
		case *ast.Image:
			p.SetFont("Arial", r.fontStyleFrom(st), fontSize)
			p.Write(lineHeight, "[image]")
		case *ast.RawHTML:
			continue
		default:
			continue
		}
	}
}

func (r *markdownRenderer) walk(n ast.Node, entering bool) (ast.WalkStatus, error) {
	th := &r.doc.Theme
	p := r.doc.PDF

	switch t := n.(type) {
	case *ast.Document:
		return ast.WalkContinue, nil

	case *ast.Heading:
		if entering {
			sz := pdfdoc.HeadingSizePt(t.Level)
			lh := pdfdoc.HeadingLineHeight(sz)
			r.syncLeftMargin()
			p.SetX(r.textX())
			th.SetHeadingInk(p)
			p.SetFont("Arial", "B", sz)
			r.renderInlines(t, lh, sz, inlineStyle{bold: 1})
			p.Ln(lh + 1.5)
			th.SetHeadingRuleStroke(p, 0.35)
			pageW, _ := p.GetPageSize()
			_, _, rM, _ := p.GetMargins()
			y := p.GetY()
			x1 := r.textX()
			if x1 > pageW-rM-24 {
				x1 = pageW - rM - 80
			}
			p.Line(x1, y, pageW-rM, y)
			p.Ln(3)
			th.SetBodyText(p)
			th.ResetDraw(p)
		}
		return ast.WalkSkipChildren, nil

	case *ast.Paragraph:
		if entering {
			r.syncLeftMargin()
			p.SetX(r.textX())
			p.SetFont("Arial", "", r.bodySize)
			th.SetBodyText(p)
			r.renderInlines(t, r.lineHeight, r.bodySize, inlineStyle{})
			p.Ln(r.lineHeight * 1.35)
		}
		return ast.WalkSkipChildren, nil

	case *ast.ThematicBreak:
		if entering {
			r.syncLeftMargin()
			pageW, _ := p.GetPageSize()
			_, _, rM, _ := p.GetMargins()
			y := p.GetY() + 2
			th.SetThematicBreakStroke(p, 0.3)
			x1 := r.textX()
			p.Line(x1, y, pageW-rM-2, y)
			th.ResetDraw(p)
			p.SetY(y + 4)
		}
		return ast.WalkContinue, nil

	case *ast.Blockquote:
		if entering {
			r.blockquoteNest++
			r.syncLeftMargin()
		} else {
			r.blockquoteNest--
			if r.blockquoteNest < 0 {
				r.blockquoteNest = 0
			}
			r.syncLeftMargin()
			p.Ln(1.5)
		}
		return ast.WalkContinue, nil

	case *ast.List:
		if entering {
			start := t.Start
			if t.IsOrdered() && start < 1 {
				start = 1
			}
			r.listStack = append(r.listStack, listFrame{ordered: t.IsOrdered(), next: start})
			r.syncLeftMargin()
		} else {
			if len(r.listStack) > 0 {
				r.listStack = r.listStack[:len(r.listStack)-1]
			}
			r.syncLeftMargin()
			p.Ln(2)
		}
		return ast.WalkContinue, nil

	case *ast.ListItem:
		if entering {
			if len(r.listStack) == 0 {
				return ast.WalkContinue, nil
			}
			frame := &r.listStack[len(r.listStack)-1]
			l, _, _, _ := p.GetMargins()
			depth := len(r.listStack) - 1
			if depth < 0 {
				depth = 0
			}
			bx := l + r.blockquoteShift() + float64(depth)*6
			var marker string
			if frame.ordered {
				marker = fmt.Sprintf("%d. ", frame.next)
				frame.next++
			} else {
				marker = "- "
			}
			p.SetFont("Arial", "B", r.bodySize)
			mw := p.GetStringWidth(marker)
			contentLeft := bx + mw + 1.2
			r.listMarginStack = append(r.listMarginStack, contentLeft)
			p.SetLeftMargin(contentLeft)
			p.SetX(bx)
			th.SetListMarkerInk(p)
			p.Write(r.lineHeight, marker)
			th.SetBodyText(p)
			p.SetFont("Arial", "", r.bodySize)
		} else {
			if len(r.listMarginStack) > 0 {
				r.listMarginStack = r.listMarginStack[:len(r.listMarginStack)-1]
			}
			l, _, _, _ := p.GetMargins()
			if len(r.listMarginStack) > 0 {
				p.SetLeftMargin(r.listMarginStack[len(r.listMarginStack)-1])
			} else {
				p.SetLeftMargin(l + r.blockquoteShift())
			}
			p.Ln(r.lineHeight * 0.45)
		}
		return ast.WalkContinue, nil

	case *ast.FencedCodeBlock:
		if entering {
			r.emitCodeBlock(string(t.Text(r.src)))
		}
		return ast.WalkSkipChildren, nil

	case *ast.CodeBlock:
		if entering {
			r.emitCodeBlock(string(t.Text(r.src)))
		}
		return ast.WalkSkipChildren, nil

	case *ast.HTMLBlock:
		return ast.WalkSkipChildren, nil

	default:
		return ast.WalkContinue, nil
	}
}

func (r *markdownRenderer) emitCodeBlock(raw string) {
	th := &r.doc.Theme
	p := r.doc.PDF
	tx := pdfdoc.ToPrintableASCII(strings.TrimRight(raw, "\n"))
	if tx == "" {
		return
	}
	r.syncLeftMargin()
	p.SetX(r.textX())
	p.SetFillColor(th.CodeFillR, th.CodeFillG, th.CodeFillB)
	p.SetDrawColor(th.CodeBorderR, th.CodeBorderG, th.CodeBorderB)
	p.SetFont("Courier", "", r.bodySize-1)
	th.SetCodeText(p)
	p.MultiCell(0, 4.3, tx, "LR", "L", true)
	th.SetBodyText(p)
	p.SetFont("Arial", "", r.bodySize)
	th.ResetDraw(p)
	p.Ln(5)
}

func renderMarkdownBody(doc *pdfdoc.Document, markdown string, bodySize, lineHeight float64) error {
	r := &markdownRenderer{
		doc:        doc,
		src:        []byte(markdown),
		bodySize:   bodySize,
		lineHeight: lineHeight,
	}
	r.syncLeftMargin()
	root := parseMarkdownRoot(markdown)
	return ast.Walk(root, r.walk)
}
