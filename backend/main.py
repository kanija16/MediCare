from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database
from pydantic import BaseModel
from typing import List

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="MediCare API", description="Hospital Management System API")

# Setup CORS to allow cross-origin requests from both vanilla and react frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models for request validation
class PatientRegistration(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class AppointmentBooking(BaseModel):
    doctor_id: int
    patient_name: str
    date: str
    time: str

@app.on_event("startup")
def seed_data():
    """Seed the database with initial doctor data if empty."""
    db = database.SessionLocal()
    if not db.query(models.Doctor).first():
        docs = [
            models.Doctor(name="Dr. Sarah Connor", specialty="Cardiology", experience="10 Years"),
            models.Doctor(name="Dr. John Smith", specialty="Neurology", experience="8 Years"),
            models.Doctor(name="Dr. Emily Davis", specialty="Pediatrics", experience="5 Years"),
            models.Doctor(name="Dr. Michael Brown", specialty="Orthopedics", experience="12 Years"),
            models.Doctor(name="Dr. Jessica Wilson", specialty="Dermatology", experience="7 Years")
        ]
        db.add_all(docs)
        db.commit()
    db.close()

@app.get("/doctors")
def get_doctors(db: Session = Depends(get_db)):
    """Fetch list of all doctors."""
    return db.query(models.Doctor).all()

@app.post("/register")
def register_patient(patient: PatientRegistration, db: Session = Depends(get_db)):
    """Register a new patient."""
    db_patient = db.query(models.Patient).filter(models.Patient.email == patient.email).first()
    if db_patient:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_patient = models.Patient(
        name=patient.name,
        email=patient.email,
        phone=patient.phone,
        password=patient.password
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return {"message": "Registration successful", "patient_id": new_patient.id}

@app.post("/appointment")
def book_appointment(appt: AppointmentBooking, db: Session = Depends(get_db)):
    """Book an appointment with a doctor."""
    doctor = db.query(models.Doctor).filter(models.Doctor.id == appt.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
        
    new_appt = models.Appointment(
        doctor_id=appt.doctor_id,
        patient_name=appt.patient_name,
        date=appt.date,
        time=appt.time
    )
    db.add(new_appt)
    db.commit()
    db.refresh(new_appt)
    return {"message": "Appointment booked successfully", "appointment_id": new_appt.id}
