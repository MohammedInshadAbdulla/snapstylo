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
        Production-level FLUX 1.1 [pro] generation.
        The current industry leader in speed and realism.
        """
        configure_fal()
        
        arguments = {
            "prompt": prompt,
            "num_inference_steps": 28,
            "guidance_scale": 3.5,
            "image_size": "portrait_4_5"
        }

        if input_image_url:
            arguments["image_url"] = input_image_url
            arguments["strength"] = 0.5
            # Using the image-to-image specialized endpoint for pro
            endpoint = "fal-ai/flux-pro/v1.1/image-to-image"
        else:
            endpoint = "fal-ai/flux-pro/v1.1"

        result = await fal_client.subscribe_async(
            endpoint,
            arguments=arguments
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
