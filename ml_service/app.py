from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from model import engine

app = FastAPI(title="DefectIQ Python ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TrainRequest(BaseModel):
    custom_data_path: Optional[str] = None

class PredictRequest(BaseModel):
    Machine_ID: Optional[str] = "M-04"
    Line_ID: Optional[str] = "Line-2"
    Temperature: float = 84.0
    Pressure: float = 10.1
    Speed: float = 1450.0
    Vibration: float = 4.8
    Humidity: float = 72.0
    Shift: Optional[str] = "Night"
    Operator: Optional[str] = "Op-Alice"

class RootCauseRequest(BaseModel):
    Machine_ID: Optional[str] = "M-04"
    Defect_Type: Optional[str] = None

@app.on_event("startup")
def startup_event():
    print("Initializing & Training DefectIQ ML Engine...")
    res = engine.train()
    print("Engine Training Status:", res)

@app.get("/")
def read_root():
    return {"service": "DefectIQ Python ML API Engine", "status": "online", "trained": engine.is_trained}

@app.get("/health")
def health_check():
    return {"status": "ok", "is_trained": engine.is_trained}

@app.post("/train")
def train_model(req: TrainRequest):
    res = engine.train(req.custom_data_path)
    return res

@app.post("/predict")
def predict_risk(req: PredictRequest):
    try:
        params = req.dict()
        res = engine.predict_batch_risk(params)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/root-cause")
def analyze_root_cause(req: RootCauseRequest):
    try:
        res = engine.analyze_root_cause(req.Machine_ID, req.Defect_Type)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
