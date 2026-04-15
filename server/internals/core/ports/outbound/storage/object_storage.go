package storage

import (
	"context"
	"io"
)

type ObjectStorage interface {
	Put(ctx context.Context, key string, body io.Reader, contentType string) error
	Delete(ctx context.Context, key string) error
}
