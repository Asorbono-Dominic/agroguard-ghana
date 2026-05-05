import httpx
from typing import Dict

# Ghana regions mapped to lat/lng
REGION_COORDS = {
    "Ashanti": (6.7470, -1.5209),
    "Brong-Ahafo": (7.9465, -1.6728),
    "Central": (5.5502, -1.0137),
    "Eastern": (6.5244, -0.4614),
    "Greater Accra": (5.6037, -0.1870),
    "Northern": (9.5404, -0.9061),
    "Upper East": (10.7551, -0.9847),
    "Upper West": (10.2529, -2.1047),
    "Volta": (6.9127, 0.4638),
    "Western": (5.1315, -2.0338),
}

async def get_weather(region: str) -> Dict:
    coords = REGION_COORDS.get(region, (7.9465, -1.6728))
    lat, lng = coords

    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lng}"
        f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_max"
        f"&forecast_days=7&timezone=Africa%2FAccra"
    )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()

        daily = data.get("daily", {})
        temp_max = daily.get("temperature_2m_max", [32])[0]
        temp_min = daily.get("temperature_2m_min", [22])[0]
        precip = sum(daily.get("precipitation_sum", [10]))
        humidity = daily.get("relative_humidity_2m_max", [65])[0]

        return {
            "temperature_max": temp_max,
            "temperature_min": temp_min,
            "precipitation_7day": round(precip, 1),
            "humidity": humidity,
        }

    except Exception:
        # Fallback to safe defaults if API fails
        return {
            "temperature_max": 32.0,
            "temperature_min": 22.0,
            "precipitation_7day": 25.0,
            "humidity": 65.0,
        } 
