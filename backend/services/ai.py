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

    async def generate_image(self, prompt: str, input_image_url: str = None, **kwargs):
        """
        Professional FLUX Dev generation with granular control.
        Supports advanced parameters for studio-grade artistic output.
        """
        configure_fal()
        
        # Default parameters aligned with FLUX Dev best practices
        arguments = {
            "prompt": prompt,
            "num_inference_steps": kwargs.get("num_inference_steps", 28),
            "guidance_scale": kwargs.get("guidance_scale", 3.5),
            "image_size": kwargs.get("aspect_ratio", "portrait_4_5"),
            "enable_safety_checker": True
        }

        if kwargs.get("seed"):
            arguments["seed"] = kwargs.get("seed")

        if input_image_url:
            arguments["image_url"] = input_image_url
            arguments["strength"] = kwargs.get("prompt_strength", 0.5)
            # Image-to-image specialized endpoint
            endpoint = "fal-ai/flux/dev/image-to-image"
        else:
            endpoint = "fal-ai/flux/dev"

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
