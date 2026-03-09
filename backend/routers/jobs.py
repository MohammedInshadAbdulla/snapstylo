import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from auth import get_current_user
from models import User, Job, JobStatus
from services.storage import storage_service
from services.queue import get_redis
from database import get_session
from sqlmodel import Session, select
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/jobs", tags=["jobs"])

class UploadURLResponse(BaseModel):
    upload_url: str
    key: str

class SubmitJobRequest(BaseModel):
    style_id: str
    input_r2_key: str
    mask_r2_key: Optional[str] = None
    idempotency_key: str
    task_type: str = "generate"
    prompt: Optional[str] = None
    aspect_ratio: str = "portrait_4_5"
    guidance_scale: float = 3.5
    num_inference_steps: int = 28
    prompt_strength: float = 0.5
    seed: Optional[int] = None

@router.get("/upload-url", response_model=UploadURLResponse)
async def get_upload_url(current_user: User = Depends(get_current_user)):
    file_id = str(uuid.uuid4())
    key = f"uploads/{current_user.id}/{file_id}"
    url = storage_service.generate_presigned_url(key)
    return {"upload_url": url, "key": key}

@router.post("/submit")
async def submit_job(
    request: SubmitJobRequest, 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # 1. Idempotency Check
    existing_job = session.exec(
        select(Job).where(Job.idempotency_key == request.idempotency_key)
    ).first()
    if existing_job:
        return {"job_id": existing_job.id, "status": existing_job.status}

    # 2. Credit Check
    if current_user.credit_balance < 1:
        raise HTTPException(status_code=402, detail="Insufficient credits")

    # 3. Create Job
    job_id = str(uuid.uuid4())
    job = Job(
        id=job_id,
        user_id=current_user.id,
        status=JobStatus.PENDING,
        task_type=request.task_type,
        style_id=request.style_id,
        prompt=request.prompt,
        aspect_ratio=request.aspect_ratio,
        guidance_scale=request.guidance_scale,
        num_inference_steps=request.num_inference_steps,
        prompt_strength=request.prompt_strength,
        seed=request.seed,
        input_r2_key=request.input_r2_key,
        mask_r2_key=request.mask_r2_key,
        idempotency_key=request.idempotency_key
    )
    session.add(job)
    session.commit()

    # 4. Push to Queue
    redis = await get_redis()
    await redis.enqueue_job('process_generation', job_id)
    
    return {"job_id": job_id, "status": JobStatus.PENDING}

@router.get("/", response_model=list[dict])
async def list_jobs(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    statement = select(Job).where(Job.user_id == current_user.id).order_by(Job.created_at.desc())
    jobs = session.exec(statement).all()
    return [
        {
            "id": job.id,
            "status": job.status,
            "style_id": job.style_id,
            "output": job.output_r2_key,
            "created_at": job.created_at
        } for job in jobs
    ]

@router.get("/{job_id}")
async def get_job_status(job_id: str, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    statement = select(Job).where(Job.id == job_id, Job.user_id == current_user.id)
    job = session.exec(statement).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {
        "id": job.id, 
        "status": job.status, 
        "output": storage_service.get_download_url(job.output_r2_key) if job.output_r2_key else None,
        "error": job.error_message,
        "created_at": job.created_at
    }
