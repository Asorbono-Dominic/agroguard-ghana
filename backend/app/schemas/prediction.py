from pydantic import BaseModel, Field
from typing import Optional, List

class PredictionRequest(BaseModel):
    region: str = Field(..., example="Ashanti")
    crop_type: str = Field(..., example="maize")
    planting_month: int = Field(..., ge=1, le=12, example=4)
    days_since_planting: int = Field(..., ge=1, le=180, example=30)
    soil_ph: Optional[float] = Field(6.0, ge=4.0, le=8.0, example=6.0)
    phone_number: Optional[str] = Field(None, example="+233241234567")

class PredictionResponse(BaseModel):
    risk_score: float
    risk_level: str
    factors: List[str]
    recommendations: List[str]
    prediction_id: str

class AlertRequest(BaseModel):
    phone_number: str
    prediction_id: str
    risk_score: float
    risk_level: str
    crop_type: str
    region: str
    top_factor: str 
