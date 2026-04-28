package textract

import (
	"context"
	"strings"

	"github.com/adk-saugat/snapstudy/server/internals/core/ports/outbound/textract"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	awstextract "github.com/aws/aws-sdk-go-v2/service/textract"
	awstextracttypes "github.com/aws/aws-sdk-go-v2/service/textract/types"
)

type AWSDocumentTextExtractor struct {
	client *awstextract.Client
}

func NewAWSDocumentTextExtractor(ctx context.Context, region string) (*AWSDocumentTextExtractor, error) {
	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion(region))
	if err != nil {
		return nil, err
	}

	return &AWSDocumentTextExtractor{
		client: awstextract.NewFromConfig(cfg),
	}, nil
}

func (e *AWSDocumentTextExtractor) Extract(ctx context.Context, bucket, key, contentType string) (textract.ExtractResult, error) {
	output, err := e.client.DetectDocumentText(ctx, &awstextract.DetectDocumentTextInput{
		Document: &awstextracttypes.Document{
			S3Object: &awstextracttypes.S3Object{
				Bucket: aws.String(bucket),
				Name:   aws.String(key),
			},
		},
	})
	if err != nil {
		return textract.ExtractResult{}, err
	}

	lines := make([]string, 0)
	for _, block := range output.Blocks {
		if block.BlockType == awstextracttypes.BlockTypeLine && block.Text != nil && strings.TrimSpace(*block.Text) != "" {
			lines = append(lines, strings.TrimSpace(*block.Text))
		}
	}

	return textract.ExtractResult{
		Text:      strings.Join(lines, "\n"),
		LineCount: len(lines),
	}, nil
}
