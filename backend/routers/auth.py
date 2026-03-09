from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from database import get_session
from models import User
from auth import get_password_hash, verify_password, create_access_token
import random
from services.email import send_otp_email
from pydantic import BaseModel, EmailStr, Field

router = APIRouter(prefix="/auth", tags=["auth"])

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class Token(BaseModel):
    access_token: str
    token_type: str

class VerifyOTP(BaseModel):
    email: EmailStr
    code: str

@router.post("/register")
async def register(user_data: UserCreate, session: Session = Depends(get_session)):
    # Check if user exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    
    if existing_user:
        if existing_user.is_verified:
            raise HTTPException(status_code=400, detail="Email already registered")
        # Reuse unverified user entry
        new_user = existing_user
        new_user.hashed_password = get_password_hash(user_data.password)
    else:
        new_user = User(
            email=user_data.email,
            hashed_password=get_password_hash(user_data.password),
            credit_balance=3 # FREE tier starting credits
        )
    
    # Generate 6-digit OTP
    otp = f"{random.randint(100000, 999999)}"
    new_user.verification_code = otp
    new_user.is_verified = False # Reset if reusing
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    # Send email
    success = await send_otp_email(user_data.email, otp)
    
    return {"message": "Verification code sent to email"}

@router.post("/verify", response_model=Token)
async def verify(data: VerifyOTP, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == data.email)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.verification_code != data.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
        
    user.is_verified = True
    user.verification_code = None
    session.add(user)
    session.commit()
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not verified. Please verify your email.",
        )
        
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
