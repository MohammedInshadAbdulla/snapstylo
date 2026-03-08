import os
import asyncio
from dotenv import load_dotenv
import fal_client

load_dotenv()

async def test_fal():
    key = os.getenv("FAL_KEY")
    print(f"Key found: {bool(key)}")
    if key:
        print(f"Key format: {key[:5]}...:{key[-5:]}")
        os.environ["FAL_KEY"] = key
    
    print("\nAttempting FLUX generation on fal.ai...")
    try:
        result = await fal_client.subscribe_async(
            "fal-ai/flux/schnell",
            arguments={
                "prompt": "a futuristic car in neon style",
                "image_size": {
                    "width": 768,
                    "height": 1024
                }
            }
        )
        print("Success!")
        print(f"Image URL: {result['images'][0]['url']}")
    except Exception as e:
        print(f"FAILED: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_fal())
