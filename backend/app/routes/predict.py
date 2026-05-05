from fastapi import APIRouter, HTTPException
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.weather_service import get_weather
from app.services.prediction_service import predict
from app.services.sms_service import send_alert
import uuid

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict_crop_loss(request: PredictionRequest):
    try:
        # Step 1: Fetch weather for region
        weather = await get_weather(request.region)

        # Step 2: Run ML prediction
        result = predict(
            region=request.region,
            crop_type=request.crop_type,
            planting_month=request.planting_month,
            days_since_planting=request.days_since_planting,
            soil_ph=request.soil_ph or 6.0,
            weather=weather,
        )

        prediction_id = str(uuid.uuid4())

        # Step 3: Auto-trigger SMS if high risk and phone provided
        if result["risk_score"] >= 70 and request.phone_number:
            top_factor = (
                result["factors"][0]
                if result["factors"]
                else "multiple risk factors"
            )
            send_alert(
                phone_number=request.phone_number,
                crop_type=request.crop_type,
                region=request.region,
                risk_score=result["risk_score"],
                risk_level=result["risk_level"],
                top_factor=top_factor,
            )

        return PredictionResponse(
            risk_score=result["risk_score"],
            risk_level=result["risk_level"],
            factors=result["factors"],
            recommendations=result["recommendations"],
            prediction_id=prediction_id,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
