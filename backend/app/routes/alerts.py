from fastapi import APIRouter, HTTPException
from app.schemas.prediction import AlertRequest
from app.services.sms_service import send_alert

router = APIRouter()

@router.post("/send-alert")
async def send_sms_alert(request: AlertRequest):
    try:
        result = send_alert(
            phone_number=request.phone_number,
            crop_type=request.crop_type,
            region=request.region,
            risk_score=request.risk_score,
            risk_level=request.risk_level,
            top_factor=request.top_factor,
        )
        return {"message": "Alert processed", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
