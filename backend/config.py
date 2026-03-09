from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    # Database & Redis
    DATABASE_URL: str
    REDIS_URL: str

    # AI Providers
    REPLICATE_API_TOKEN: Optional[str] = None
    FAL_KEY: Optional[str] = None

    # Storage (R2)
    R2_ACCOUNT_ID: str
    R2_ACCESS_KEY_ID: str
    R2_SECRET_ACCESS_KEY: str
    R2_BUCKET_NAME: str

    # Auth
    JWT_SECRET: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 * 24 * 60  # 30 days

    # Stripe
    STRIPE_SECRET_KEY: str = "sk_test_..."
    STRIPE_WEBHOOK_SECRET: str = "whsec_..."
    
    # URLs
    FRONTEND_URL: str = "http://localhost:3000"

    # AWS
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"

    ENV: str = "dev"

    # Email (Resend)
    RESEND_API_KEY: Optional[str] = None
    SMTP_FROM: str = "SnapStylo <onboarding@resend.dev>"
    
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), ".env"),
        extra='ignore'
    )

settings = Settings()
