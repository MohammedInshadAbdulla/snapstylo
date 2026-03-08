from datetime import datetime
from typing import List, Optional
from sqlmodel import Field, SQLModel, JSON, Column

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    credit_balance: int = Field(default=0)
    is_premium: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class JobStatus(str):
    PENDING = "pending"
    MODERATING = "moderating"
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"

class Job(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    status: str = Field(default=JobStatus.PENDING)
    style_id: str
    input_r2_key: str
    output_r2_key: Optional[str] = None
    idempotency_key: str = Field(unique=True, index=True)
    error_message: Optional[str] = None
    metadata_json: dict = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

class Style(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    description: str
    prompt_template: str
    negative_prompt: Optional[str] = None
    lora_path: Optional[str] = None
    preview_url: Optional[str] = None
    is_active: bool = Field(default=True)
    category: Optional[str] = None
