from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, jobs, payments
from database import init_db
from auth import get_current_user
from models import User

from config import settings

app = FastAPI(title="Popular Style API")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://snapstylo.com",
    "https://www.snapstylo.com",
]

# Add production domains from settings
if settings.FRONTEND_URL:
    clean_url = settings.FRONTEND_URL.strip().rstrip("/")
    if clean_url not in origins:
        origins.append(clean_url)
    
    # Add variations for production URL
    if "https://" in clean_url:
        if "www." not in clean_url:
            origins.append(clean_url.replace("https://", "https://www."))
        else:
            origins.append(clean_url.replace("https://www.", "https://"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(payments.router)

@app.on_event("startup")
def on_startup():
    # Attempt to initialize the database
    try:
        init_db()
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
        # In a real environment, you'd want to handle this more gracefully
        # like using migration tools (Alembic)

@app.get("/users/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "credit_balance": current_user.credit_balance
    }

@app.get("/")
async def root():
    return {
        "message": "Popular Style API is running",
        "env": settings.ENV
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
