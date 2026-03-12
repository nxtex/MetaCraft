import os
from minio import Minio

_client = Minio(
    os.environ["MINIO_ENDPOINT"],
    access_key=os.environ["MINIO_ACCESS_KEY"],
    secret_key=os.environ["MINIO_SECRET_KEY"],
    secure=False,
)
BUCKET = os.environ["MINIO_BUCKET"]


def download(object_key: str, dest_path: str):
    _client.fget_object(BUCKET, object_key, dest_path)


def upload(object_key: str, src_path: str, content_type: str):
    _client.fput_object(BUCKET, object_key, src_path, content_type=content_type)
