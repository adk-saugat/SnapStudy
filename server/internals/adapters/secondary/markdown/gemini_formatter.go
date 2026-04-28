package markdown

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	outboundMarkdown "github.com/adk-saugat/snapstudy/server/internals/core/ports/outbound/markdown"
	"google.golang.org/genai"
)

const geminiModel = "gemini-2.5-flash"

type GeminiFormatter struct {
	client *genai.Client
}

func NewGeminiFormatter(apiKey string) (*GeminiFormatter, error) {
	if strings.TrimSpace(apiKey) == "" {
		return nil, errors.New("gemini api key is required")
	}

	client, err := genai.NewClient(context.Background(), &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		return nil, err
	}

	return &GeminiFormatter{
		client: client,
	}, nil
}

func (f *GeminiFormatter) FormatFromExtractedText(ctx context.Context, rawText string) (*outboundMarkdown.ChapterContent, error) {
	trimmed := strings.TrimSpace(rawText)
	if trimmed == "" {
		return &outboundMarkdown.ChapterContent{}, nil
	}

	prompt := "You are a formatter. Convert the OCR text below into clean, readable Markdown and create a concise chapter title.\nReturn STRICT JSON ONLY with keys: title, markdown.\nDo not add hallucinated facts.\n\nOCR TEXT:\n" + trimmed
	response, err := f.client.Models.GenerateContent(ctx, geminiModel, genai.Text(prompt), nil)
	if err != nil {
		return nil, fmt.Errorf("gemini sdk request failed: %w", err)
	}
	if response == nil || strings.TrimSpace(response.Text()) == "" {
		return nil, errors.New("gemini returned no content")
	}

	content := unwrapFencedContent(response.Text())

	var chapter outboundMarkdown.ChapterContent
	if err := json.Unmarshal([]byte(content), &chapter); err != nil {
		return nil, fmt.Errorf("failed to parse gemini json response: %w", err)
	}

	chapter.Title = strings.TrimSpace(chapter.Title)
	chapter.Markdown = strings.TrimSpace(chapter.Markdown)
	if chapter.Markdown == "" {
		return nil, errors.New("gemini returned empty markdown")
	}

	return &chapter, nil
}

func unwrapFencedContent(content string) string {
	trimmed := strings.TrimSpace(content)
	if !strings.HasPrefix(trimmed, "```") {
		return trimmed
	}

	lines := strings.Split(trimmed, "\n")
	if len(lines) == 0 {
		return trimmed
	}

	// Drop opening fence line (with or without language tag).
	lines = lines[1:]

	// Drop trailing fence line if present.
	if len(lines) > 0 && strings.TrimSpace(lines[len(lines)-1]) == "```" {
		lines = lines[:len(lines)-1]
	}

	return strings.TrimSpace(strings.Join(lines, "\n"))
}
