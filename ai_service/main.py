from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import random
from typing import List, Optional
import datetime

app = FastAPI(title="GearGuide Superior AI Service")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AI TRAINING PIPELINE (Synthetic Data) ---

def generate_training_data():
    np.random.seed(42)
    n_samples = 1000
    # Features: Temperature, Pressure, Vibration, Humidity, RPM, PowerUsage
    temp = np.random.normal(70, 15, n_samples)
    pressure = np.random.normal(50, 10, n_samples)
    vibration = np.random.normal(0.8, 0.3, n_samples)
    humidity = np.random.normal(45, 10, n_samples)
    rpm = np.random.normal(1500, 300, n_samples)
    power = np.random.normal(200, 50, n_samples)
    
    # Target: Failure (1 if high vibration or high temp or high pressure)
    failure = []
    for t, p, v in zip(temp, pressure, vibration):
        if v > 1.2 or t > 100 or p > 80:
            # High probability of failure
            failure.append(1 if random.random() > 0.1 else 0)
        else:
            # Low probability of failure
            failure.append(1 if random.random() > 0.95 else 0)
            
    df = pd.DataFrame({
        'temp': temp,
        'pressure': pressure,
        'vibration': vibration,
        'humidity': humidity,
        'rpm': rpm,
        'power': power,
        'failure': failure
    })
    return df

# Train the model on startup
print("Training AI Model...")
training_data = generate_training_data()
X = training_data.drop('failure', axis=1)
y = training_data['failure']
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)
print("Model Trained Successfully.")

# --- MODELS ---

class MachineData(BaseModel):
    temperature: float
    pressure: float
    vibration: float
    humidity: float
    rpm: float
    power_usage: float

class PredictionResponse(BaseModel):
    health_score: int
    failure_risk: float
    status: str

class RootCauseResponse(BaseModel):
    machine_name: str
    risk_level: str
    cause: str
    reason: str
    impact: str

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

class ChatResponse(BaseModel):
    response: str

# --- ENDPOINTS ---

@app.post("/predict", response_model=PredictionResponse)
async def predict(data: MachineData):
    input_data = [[data.temperature, data.pressure, data.vibration, data.humidity, data.rpm, data.power_usage]]
    prob = model.predict_proba(input_data)[0][1]
    
    health_score = int((1 - prob) * 100)
    failure_risk = round(prob * 100, 2)
    
    status = "Healthy"
    if failure_risk > 70:
        status = "Critical"
    elif failure_risk > 30:
        status = "Warning"
        
    return {
        "health_score": health_score,
        "failure_risk": failure_risk,
        "status": status
    }

@app.post("/analyze", response_model=RootCauseResponse)
async def analyze(data: MachineData):
    # Logic based on thresholds
    cause = "Normal Operation"
    reason = "All sensors within normal range."
    impact = "High efficiency"
    risk_level = "LOW"
    
    if data.vibration > 1.2:
        cause = "Bearing wear"
        reason = "Unusual vibration frequency detected in spindle"
        impact = "Potential mechanical breakdown"
        risk_level = "HIGH"
    elif data.temperature > 100:
        cause = "Thermal Overload"
        reason = "Inadequate cooling or excessive friction"
        impact = "Component deformation"
        risk_level = "HIGH"
    elif data.pressure > 80:
        cause = "Seal degradation"
        reason = "Pressure exceeding standard operational limits"
        impact = "Hydraulic fluid leakage"
        risk_level = "MEDIUM"
        
    return {
        "machine_name": "Selected Asset",
        "risk_level": risk_level,
        "cause": cause,
        "reason": reason,
        "impact": impact
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    msg = request.message.lower()
    
    # Simple simulated LLM/Agent response based on "Internet knowledge" and "Logs"
    if "failing" in msg or "why" in msg:
        response = "Based on recent sensor logs, Machine A is showing 1.4mm/s vibration levels, which exceed the 1.2 safety threshold. This is typical for bearing wear in the CNC-200 series after 5000 hours of operation."
    elif "fix" in msg or "overheating" in msg:
        response = "To fix overheating, first check the coolant levels. If coolant is sufficient, the heat exchanger might be clogged. Our manual records suggest cleaning filters every 300 hours."
    elif "predict" in msg or "next failure" in msg:
        response = "Predictive analysis indicates a 78% probability of failure for the Pump System in 4 days if the current pressure oscillations continue."
    else:
        response = "I am GearBot, your industrial maintenance copilot. I have access to real-time sensor data, historical logs, and machine manuals. How can I help you optimize your floor operations today?"
        
    return {"response": response}

@app.get("/alerts")
async def get_alerts():
    # Simulated real-time alerts
    return [
        {"id": 1, "type": "High Vibration", "machine": "Lathe-01", "level": "Critical", "value": 1.4, "time": "2 mins ago"},
        {"id": 2, "type": "Overheating", "machine": "Motor-B4", "level": "Warning", "value": 105, "time": "15 mins ago"},
        {"id": 3, "type": "Pressure Anomaly", "machine": "Pump-X", "level": "Notice", "value": 82, "time": "1 hour ago"},
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
