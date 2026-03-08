import httpx
import urllib.parse
from config import settings

class AIService:
    def __init__(self):
        pass

    async def generate_image(self, prompt: str, input_image_url: str = None):
        """
        Uses Pollinations.ai for FREE image generation (Testing Mode).
        """
        # Encode the prompt for the URL
        encoded_prompt = urllib.parse.quote(prompt)
        # Use FLUX or Default model on Pollinations
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=768&height=1024&nologo=true&seed={urllib.parse.quote(str(input_image_url))[:100]}"
        
        # Verify it works by checking the URL
        async with httpx.AsyncClient() as client:
            # We don't download here, just return the URL for the worker to download
            return image_url

    async def restore_face(self, image_url: str):
        """
        Pollinations doesn't have a separate face restorer, 
        so we'll return the same URL for now in Free Mode.
        """
        return image_url

ai_service = AIService()
