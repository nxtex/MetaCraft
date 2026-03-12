package storage

import (
	"context"
	"fmt"
	"io"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type MinIOClient struct {
	client *minio.Client
	bucket string
}

func NewMinIO(endpoint, accessKey, secretKey, bucket string) (*MinIOClient, error) {
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: false, // set true in production with TLS
	})
	if err != nil {
		return nil, fmt.Errorf("minio client: %w", err)
	}

	ctx := context.Background()
	exists, err := client.BucketExists(ctx, bucket)
	if err != nil {
		return nil, fmt.Errorf("bucket check: %w", err)
	}
	if !exists {
		if err := client.MakeBucket(ctx, bucket, minio.MakeBucketOptions{}); err != nil {
			return nil, fmt.Errorf("make bucket: %w", err)
		}
	}
	return &MinIOClient{client: client, bucket: bucket}, nil
}

func (m *MinIOClient) Upload(ctx context.Context, objectName string, reader io.Reader, size int64, contentType string) error {
	_, err := m.client.PutObject(ctx, m.bucket, objectName, reader, size,
		minio.PutObjectOptions{ContentType: contentType},
	)
	return err
}

func (m *MinIOClient) PresignedURL(ctx context.Context, objectName string, ttl time.Duration) (string, error) {
	u, err := m.client.PresignedGetObject(ctx, m.bucket, objectName, ttl, nil)
	if err != nil {
		return "", err
	}
	return u.String(), nil
}

func (m *MinIOClient) Delete(ctx context.Context, objectName string) error {
	return m.client.RemoveObject(ctx, m.bucket, objectName, minio.RemoveObjectOptions{})
}
