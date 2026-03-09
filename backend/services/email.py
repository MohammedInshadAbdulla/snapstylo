import httpx
from config import settings

def send_otp_email(email: str, otp: str):
    log_msg = f"Attempting to send OTP to {email}: {otp}\n"
    with open("email_debug.log", "a") as f:
        f.write(log_msg)
        
    if not settings.RESEND_API_KEY:
        with open("email_debug.log", "a") as f:
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
                <p style="font-size: 11px; color: #555; margin-top: 20px;">
                    Sent via the elite FLUX 1.1 Pro studio engine.
                </p>
            </body>
        </html>
        """

        payload = {
            "from": settings.SMTP_FROM,
            "to": email,
            "subject": f"{otp} is your SnapStylo code",
            "html": body
        }

        with httpx.Client() as client:
            response = client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            
        with open("email_debug.log", "a") as f:
            f.write(f"Email sent successfully to {email}\n")
        return True
    except Exception as e:
        error_info = f"Error sending email via Resend: {e}\n"
        if hasattr(e, 'response') and e.response is not None:
             error_info += f"Resend Error Response: {e.response.text}\n"
        
        with open("email_debug.log", "a") as f:
            f.write(error_info)
        return False
