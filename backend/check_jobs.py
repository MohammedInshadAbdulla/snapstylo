from sqlmodel import Session, select, create_engine
from models import Job
import os
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL"))

def check_jobs():
    with Session(engine) as session:
        statement = select(Job).order_by(Job.created_at.desc()).limit(5)
        jobs = session.exec(statement).all()
        
        if not jobs:
            print("No jobs found in database.")
            return

        print(f"{'ID':<38} | {'Status':<12} | {'Error'}")
        print("-" * 80)
        for job in jobs:
            print(f"{job.id:<38} | {job.status:<12} | {job.error_message}")

if __name__ == "__main__":
    check_jobs()
