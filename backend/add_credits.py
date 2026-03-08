from sqlmodel import Session, select, create_engine
from models import User
import os
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL"))

def add_unlimited_credits():
    with Session(engine) as session:
        statement = select(User)
        users = session.exec(statement).all()
        
        if not users:
            print("No users found to update.")
            return

        for user in users:
            print(f"Updating user: {user.email} (Current: {user.credit_balance})")
            user.credit_balance = 9999
            session.add(user)
        
        session.commit()
        print(f"\nSUCCESS: Added 9999 credits to {len(users)} users.")

if __name__ == "__main__":
    add_unlimited_credits()
