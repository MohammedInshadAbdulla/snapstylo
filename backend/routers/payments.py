from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlmodel import Session, select
import stripe
from database import get_session
from models import User
from auth import get_current_user
from config import settings
from pydantic import BaseModel

router = APIRouter(prefix="/payments", tags=["payments"])

stripe.api_key = settings.STRIPE_SECRET_KEY

# Define credit packages matching frontend
CREDIT_PACKAGES = {
    "starter": {"credits": 50, "price": 900}, # in cents
    "pro": {"credits": 300, "price": 2900},
    "studio": {"credits": 1000, "price": 7900}, # was enterprise
}

class CheckoutRequest(BaseModel):
    package_id: str

@router.post("/create-checkout")
async def create_checkout(
    request: CheckoutRequest,
    current_user: User = Depends(get_current_user)
):
    pkg = CREDIT_PACKAGES.get(request.package_id)
    if not pkg:
        raise HTTPException(status_code=400, detail="Invalid package ID")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"SnapStylo - {pkg['credits']} Credits",
                        "description": f"Add {pkg['credits']} credits to your account",
                    },
                    "unit_amount": pkg["price"],
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"{settings.FRONTEND_URL}/dashboard?status=success",
            cancel_url=f"{settings.FRONTEND_URL}/pricing?status=cancel",
            client_reference_id=str(current_user.id),
            metadata={
                "package_id": request.package_id,
                "credits": pkg["credits"],
                "user_id": str(current_user.id)
            }
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None),
    session: Session = Depends(get_session)
):
    payload = await request.body()
    
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if event["type"] == "checkout.session.completed":
        checkout_session = event["data"]["object"]
        user_id = checkout_session.get("client_reference_id")
        credits_to_add = int(checkout_session["metadata"].get("credits", 0))

        if user_id and credits_to_add > 0:
            user = session.get(User, user_id)
            if user:
                user.credit_balance += credits_to_add
                session.add(user)
                session.commit()
                print(f"[STRIPE] Added {credits_to_add} credits to User {user_id}")

    return {"status": "success"}
