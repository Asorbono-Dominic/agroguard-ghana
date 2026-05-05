import africastalking
import os
from dotenv import load_dotenv

load_dotenv()

africastalking.initialize(
    username=os.getenv("AT_USERNAME", "sandbox"),
    api_key=os.getenv("AT_API_KEY", ""),
)
sms = africastalking.SMS

def send_alert(
    phone_number: str,
    crop_type: str,
    region: str,
    risk_score: float,
    risk_level: str,
    top_factor: str,
) -> dict:
    message = (
        f"AgroGuard Alert: {risk_level} crop loss risk "
        f"({risk_score:.0f}%) for your {crop_type} in {region}. "
        f"Key risk: {top_factor}. "
        f"Check AgroGuard for full recommendations. "
        f"Call MOFA: 0800-900-900"
    )

    try:
        response = sms.send(message, [phone_number])
        return {"status": "sent", "response": str(response)}
    except Exception as e:
        return {"status": "failed", "error": str(e)} 
