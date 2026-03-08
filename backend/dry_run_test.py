import asyncio
import os
from dotenv import load_dotenv
from sqlmodel import Session, select, create_engine
import boto3
from botocore.config import Config
import replicate
import redis.asyncio as redis

load_dotenv()

async def test_all_connections():
    print("Starting Popular Style Dry Run...")
    
    # 1. Test Database
    print("\n--- Testing Database ---")
    try:
        from models import User
        engine = create_engine(os.getenv("DATABASE_URL"))
        with Session(engine) as session:
            # Just try to query anything
            session.exec(select(User)).first()
        print("[OK] Database connection established.")
    except Exception as e:
        print(f"[ERROR] Database error: {e}")

    # 2. Test Redis (Upstash)
    print("\n--- Testing Redis (Queue) ---")
    try:
        r = redis.from_url(os.getenv("REDIS_URL"))
        await r.ping()
        print("[OK] Redis (Upstash) connected successfully.")
    except Exception as e:
        print(f"[ERROR] Redis error: {e}")

    # 3. Test Cloudflare R2
    print("\n--- Testing Cloudflare R2 ---")
    try:
        s3 = boto3.client(
            "s3",
            endpoint_url=f"https://{os.getenv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com",
            aws_access_key_id=os.getenv('R2_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('R2_SECRET_ACCESS_KEY'),
            config=Config(signature_version="s3v4"),
        )
        # Try to list objects (even if empty)
        s3.list_objects_v2(Bucket=os.getenv('R2_BUCKET_NAME'), MaxKeys=1)
        print(f"[OK] Cloudflare R2 Bucket '{os.getenv('R2_BUCKET_NAME')}' is accessible.")
    except Exception as e:
        print(f"[ERROR] R2 error: {e}")

    # 4. Test Replicate (GPU)
    print("\n--- Testing Replicate API ---")
    try:
        client = replicate.Client(api_token=os.getenv("REPLICATE_API_TOKEN"))
        # Just fetch model info instead of running it (saves money)
        model = client.models.get("black-forest-labs/flux-schnell")
        print(f"[OK] Replicate API validated. Model '{model.name}' is available.")
    except Exception as e:
        print(f"[ERROR] Replicate error: {e}")

    # 5. Test Stripe (Payments)
    print("\n--- Testing Stripe API ---")
    try:
        import stripe
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
        # Just try to retrieve the account balance info as a simple check
        stripe.Account.retrieve()
        print("[OK] Stripe API key is valid and connected.")
    except Exception as e:
        print(f"[ERROR] Stripe error: {e}")

    print("\n--- Summary ---")
    print("If all items are [OK], your production engine is correctly configured!")

if __name__ == "__main__":
    asyncio.run(test_all_connections())
