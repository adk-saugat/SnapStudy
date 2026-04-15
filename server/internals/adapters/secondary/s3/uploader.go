package s3

import (
	"context"
	"io"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/transfermanager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type Uploader struct {
	bucket string
	client *s3.Client
	tm     *transfermanager.Client
}

func NewUploader(ctx context.Context, bucket, region string) (*Uploader, error) {
	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion(region))
	if err != nil {
		return nil, err
	}

	client := s3.NewFromConfig(cfg)
	return &Uploader{
		bucket: bucket,
		client: client,
		tm:     transfermanager.New(client),
	}, nil
}

func (u *Uploader) Put(ctx context.Context, key string, body io.Reader, contentType string) error {
	in := &transfermanager.UploadObjectInput{
		Bucket: aws.String(u.bucket),
		Key:    aws.String(key),
		Body:   body,
	}
	if contentType != "" {
		in.ContentType = aws.String(contentType)
	}
	_, err := u.tm.UploadObject(ctx, in)
	return err
}

func (u *Uploader) Delete(ctx context.Context, key string) error {
	_, err := u.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(u.bucket),
		Key:    aws.String(key),
	})
	return err
}
