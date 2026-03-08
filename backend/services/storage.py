import boto3
from botocore.config import Config
from config import settings

class StorageService:
    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            endpoint_url=f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=settings.R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
            config=Config(signature_version="s3v4"),
            region_name="auto",
        )
        self.bucket = settings.R2_BUCKET_NAME

    def generate_presigned_url(self, key: str, expiration: int = 3600):
        """Generate a presigned URL to upload an object directly to R2."""
        return self.s3.generate_presigned_url(
            "put_object",
            Params={"Bucket": self.bucket, "Key": key},
            ExpiresIn=expiration,
        )

    def get_download_url(self, key: str, expiration: int = 3600):
        """Generate a presigned URL to download an object."""
        return self.s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": key},
            ExpiresIn=expiration,
        )

    def upload_bytes(self, data: bytes, key: str, content_type: str = "image/webp"):
        """Upload raw bytes to R2."""
        self.s3.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=data,
            ContentType=content_type
        )

storage_service = StorageService()
