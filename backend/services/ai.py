import fal_client
import httpx
import os
from config import settings

def configure_fal():
    if settings.FAL_KEY:
        os.environ["FAL_KEY"] = settings.FAL_KEY
        os.environ["FAL_API_KEY"] = settings.FAL_KEY
        if ":" in settings.FAL_KEY:
            parts = settings.FAL_KEY.split(":", 1)
            os.environ["FAL_KEY_ID"] = parts[0]
            os.environ["FAL_KEY_SECRET"] = parts[1]

class AIService:
    def __init__(self):
        pass

    async def generate_image(self, prompt: str, input_image_url: str = None):
        """
        Production-level FLUX.1 [dev] generation via fal.ai.
        Uses image-to-image to maintain user likeness.
        """
        configure_fal()
        
        if input_image_url:
            # Premium Image-to-Image logic
            result = await fal_client.subscribe_async(
                "fal-ai/flux/dev/image-to-image",
                arguments={
                    "prompt": prompt,
                    "image_url": input_image_url,
                    "strength": 0.5, # Balance between style and likeness
                    "num_inference_steps": 28,
                    "guidance_scale": 3.5,
                    "image_size": "portrait_4_5"
                }
            )
        else:
            # Fallback to Text-to-Image if no input provided
            result = await fal_client.subscribe_async(
                "fal-ai/flux/dev",
                arguments={
                    "prompt": prompt,
                    "num_inference_steps": 28,
                    "guidance_scale": 3.5,
                    "image_size": "portrait_4_5"
                }
            )
        
        return result["images"][0]["url"]

    async def restore_face(self, image_url: str):
        """
        High-fidelity face restoration for pro results.
        """
        configure_fal()
        result = await fal_client.subscribe_async(
            "fal-ai/face-restorer",
            arguments={
                "image_url": image_url,
                "fidelity": 0.5
            }
        )
        return result["image"]["url"]

ai_service = AIService()
