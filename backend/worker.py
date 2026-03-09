import asyncio
from config import settings
import httpx
from arq import worker
from services.ai import ai_service
from services.storage import storage_service
from services.queue import redis_settings
from database import engine
from models import Job, JobStatus, User
from sqlmodel import Session, select
from datetime import datetime
import uuid

async def heartbeat(ctx):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] --- Worker Heartbeat: OK ---")

async def process_generation(ctx, job_id: str):
    """
    Main worker task for image generation.
    """
    with Session(engine) as session:
        # 1. Fetch Job
        job = session.exec(select(Job).where(Job.id == job_id)).first()
        if not job:
            return "Job not found"

        try:
            # 2. Update Status: Moderating (placeholder for AWS Rekognition)
            job.status = JobStatus.MODERATING
            session.add(job)
            session.commit()

            # 3. Update Status: Generating
            job.status = JobStatus.GENERATING
            session.add(job)
            session.commit()

            # 4. Prompt Assembly & Parameter Extraction
            input_url = storage_service.get_download_url(job.input_r2_key, expiration=300)
            
            # Use custom prompt if provided, otherwise fallback to style template
            final_prompt = job.prompt or f"A professional realistic portrait of the person in {input_url} in a stunning {job.style_id} cinematic style"
            
            ai_params = {
                "aspect_ratio": job.aspect_ratio,
                "guidance_scale": job.guidance_scale,
                "num_inference_steps": job.num_inference_steps,
                "prompt_strength": job.prompt_strength,
                "seed": job.seed
            }

            # 5. Model Inference (Dynamic Task Routing)
            if job.task_type == "upscale":
                image_url = await ai_service.upscale(input_url)
            elif job.task_type == "outpaint":
                image_url = await ai_service.outpaint(input_url, final_prompt)
            elif job.task_type == "background":
                image_url = await ai_service.generate_background(input_url, final_prompt)
            elif job.task_type == "restore":
                image_url = await ai_service.restore_old_photo(input_url)
            else:
                # Standard Generation (FLUX Dev)
                image_url = await ai_service.generate_image(final_prompt, input_url, **ai_params)
            
            # 6. Face Restoration (Optional for non-portrait tasks in future, but keeping for now)
            # Skip restoration for outpaint/background to preserve scene integrity if needed
            if job.task_type in ["generate", "upscale"]:
                restored_url = await ai_service.restore_face(image_url)
            else:
                restored_url = image_url
            
            # 7. Download result and save to R2
            MAX_RETRIES = 3
            for attempt in range(MAX_RETRIES):
                try:
                    async with httpx.AsyncClient(timeout=60.0) as client:
                        # Adding User-Agent to avoid being blocked by free providers
                        headers = {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                        }
                        response = await client.get(restored_url, headers=headers)
                        
                        if response.status_code == 200:
                            output_key = f"results/{job.user_id}/{job_id}.webp"
                            storage_service.upload_bytes(response.content, output_key)
                            job.output_r2_key = output_key
                            break # Success!
                        else:
                            print(f"Download attempt {attempt+1} failed with status {response.status_code}")
                            if attempt < MAX_RETRIES - 1:
                                await asyncio.sleep(2) # Wait before retry
                            else:
                                raise Exception(f"Failed to download image after {MAX_RETRIES} attempts. Last status: {response.status_code}")
                except Exception as e:
                    if attempt < MAX_RETRIES - 1:
                        print(f"Download error (attempt {attempt+1}): {e}. Retrying...")
                        await asyncio.sleep(2)
                    else:
                        raise e
            
            # 8. Complete Job
            job.status = JobStatus.COMPLETED
            job.completed_at = datetime.utcnow()
            session.add(job)
            
            # 9. Finalize Credits (Tier 1 logic)
            user = session.exec(select(User).where(User.id == job.user_id)).first()
            if user:
                user.credit_balance -= 1
                session.add(user)
            
            session.commit()
            return f"Job {job_id} completed"

        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f"Error processing job {job_id}:\n{error_trace}")
            
            job.status = JobStatus.FAILED
            job.error_message = str(e) or "Unknown background error"
            session.add(job)
            session.commit()
            return f"Job {job_id} failed: {e}"

async def on_startup(ctx):
    print(f"Worker starting... Environment: {settings.ENV}")
    print(f"Redis Host: {redis_settings.host}")

async def on_shutdown(ctx):
    print("Worker shutting down...")

from arq import cron

# ARQ WorkerSettings
class WorkerSettings:
    functions = [process_generation, heartbeat]
    cron_jobs = [
        cron(heartbeat, second={0, 30})
    ]
    redis_settings = redis_settings
    on_startup = on_startup
    on_shutdown = on_shutdown
    # Sometimes helpful for SSL/Upstash
    # conn_timeout = 10
    # pool_timeout = 10
