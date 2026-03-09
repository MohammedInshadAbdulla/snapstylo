import httpx
import os
from config import settings

async def send_otp_email(email: str, otp: str):
    log_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "email_debug.log")
    
    with open(log_path, "a") as f:
        f.write(f"Attempting to send OTP to {email}: {otp}\n")
        
    if not settings.RESEND_API_KEY:
        with open(log_path, "a") as f:
            f.write("DEBUG: Skipping email send (No API Key).\n")
        return True

    try:
        url = "https://api.resend.com/emails"
        headers = {
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json"
        }
        
        body = f"""
        <html>
            <body style="font-family: sans-serif; background-color: #080808; color: #ffffff; padding: 40px; text-align: center;">
                <h1 style="color: #C9A84C;">SnapStylo</h1>
                <p style="font-size: 16px;">Welcome to the Atelier.</p>
                <div style="background-color: #121212; padding: 20px; border-radius: 8px; border: 1px solid #C9A84C; display: inline-block; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #C9A84C;">{otp}</span>
                </div>
                <p style="color: #888;">This code will expire in 10 minutes.</p>
            </body>
        </html>
        """

        payload = {
            "from": settings.SMTP_FROM,
            "to": email,
            "subject": f"{otp} is your SnapStylo code",
            "html": body
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            
        with open(log_path, "a") as f:
            f.write(f"Email sent successfully to {email}\n")
        return True
    except Exception as e:
        error_info = f"Error sending email via Resend: {e}\n"
        if hasattr(e, 'response') and e.response is not None:
             error_info += f"Resend Error Response: {e.response.text}\n"
        
        with open(log_path, "a") as f:
            f.write(error_info)
        return False
