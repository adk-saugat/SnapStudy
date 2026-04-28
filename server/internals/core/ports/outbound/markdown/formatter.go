package markdown

import "context"

type ChapterContent struct {
	Title    string
	Markdown string
}

type Formatter interface {
	FormatFromExtractedText(ctx context.Context, rawText string) (*ChapterContent, error)
}
