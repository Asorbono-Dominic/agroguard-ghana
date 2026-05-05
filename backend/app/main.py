from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.predict import router as predict_router
from app.routes.alerts import router as alerts_router
from datetime import datetime

app = FastAPI(
    title="AgroGuard Ghana API",
    description="AI-powered crop loss risk prediction for Ghanaian farmers",
    version="1.0.0",
)

# CORS — allows React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(predict_router, prefix="/api/v1", tags=["Prediction"])
app.include_router(alerts_router, prefix="/api/v1", tags=["Alerts"])

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "model": "XGBoost v1.0",
        "version": "1.0.0",
    }

@app.get("/")
async def root():
    return {"message": "AgroGuard Ghana API is running"} 
