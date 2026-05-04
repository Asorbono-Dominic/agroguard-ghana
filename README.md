 
# AgroGuard Ghana

An AI-powered crop loss risk prediction system for Ghanaian farmers.

## Overview
AgroGuard Ghana accepts farmer inputs (region, crop type, planting date),
fetches real-time weather data, and uses a trained machine learning model
to predict crop loss risk and deliver actionable recommendations via SMS.

## Tech Stack
- Frontend: React + Tailwind CSS
- Backend: FastAPI (Python)
- ML: XGBoost + SHAP
- SMS: Africa's Talking API
- Weather: Open-Meteo API (free, no key required)

## Project Structure
frontend/        React app
backend/         FastAPI API server
ml-service/      ML training and inference scripts
data/            Datasets (not committed to Git)
docs/            API documentation
scripts/         Utility scripts

## Status
Under active development — Ghana AI Innovation Challenge 2026