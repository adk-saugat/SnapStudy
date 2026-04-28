package textract

import "context"

type ExtractResult struct {
	Text      string
	LineCount int
}

type DocumentTextExtractor interface {
	Extract(ctx context.Context, bucket, key, contentType string) (ExtractResult, error)
}
