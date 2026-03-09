from sqlmodel import Session, select, create_engine
from models import User
from database import engine

def verify_all():
    with Session(engine) as session:
        statement = select(User)
        users = session.exec(statement).all()
        for user in users:
            user.is_verified = True
        session.commit()
    print("All existing users verified.")

if __name__ == "__main__":
    verify_all()
