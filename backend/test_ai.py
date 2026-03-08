import replicate
import os
from dotenv import load_dotenv

load_dotenv()

def diagnostic():
    token = os.getenv("REPLICATE_API_TOKEN")
    print(f"Token present: {bool(token)}")
    if token:
        print(f"Token starts with: {token[:5]}...")
    
    client = replicate.Client(api_token=token)
    
    print("\nAttempting to run FLUX (the model in your app)...")
    try:
        output = client.run(
            "black-forest-labs/flux-schnell",
            input={"prompt": "a small cat"}
        )
        print("Success! FLUX is working.")
        print(f"Output: {output}")
    except Exception as e:
        print(f"FAILED: {str(e)}")
        if "Insufficient credit" in str(e):
            print("\nIMPORTANT: Replicate is explicitly reporting 'Insufficient credit'.")
            print("Even if it's a 'trial', Replicate usually requires a valid Credit Card on file to prevent bot abuse.")

if __name__ == "__main__":
    diagnostic()
