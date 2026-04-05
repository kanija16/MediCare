from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from bson import ObjectId
import database

app = FastAPI(title="MediCare API", description="Hospital Management System API")

# Setup CORS to allow cross-origin requests from both vanilla and react frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional helper to convert MongoDB ObjectIds to strings
def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

def serialize_docs(docs):
    return [serialize_doc(doc) for doc in docs]

# Pydantic models for request validation
class PatientRegistration(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class AppointmentBooking(BaseModel):
    doctor_id: str
    patient_name: str
    date: str
    time: str

@app.on_event("startup")
def seed_data():
    """Seed the database with initial doctor data if empty."""
    db = database.get_db()
    if db.doctors.count_documents({}) == 0:
        docs = [
            {"name": "Dr. Sarah Connor", "specialty": "Cardiology", "experience": "10 Years"},
            {"name": "Dr. John Smith", "specialty": "Neurology", "experience": "8 Years"},
            {"name": "Dr. Emily Davis", "specialty": "Pediatrics", "experience": "5 Years"},
            {"name": "Dr. Michael Brown", "specialty": "Orthopedics", "experience": "12 Years"},
            {"name": "Dr. Jessica Wilson", "specialty": "Dermatology", "experience": "7 Years"}
        ]
        db.doctors.insert_many(docs)

@app.get("/doctors")
def get_doctors():
    """Fetch list of all doctors."""
    db = database.get_db()
    docs = list(db.doctors.find())
    return serialize_docs(docs)

@app.post("/register")
def register_patient(patient: PatientRegistration):
    """Register a new patient."""
    db = database.get_db()
    db_patient = db.patients.find_one({"email": patient.email})
    if db_patient:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_patient = patient.dict()
    result = db.patients.insert_one(new_patient)
    return {"message": "Registration successful", "patient_id": str(result.inserted_id)}

@app.post("/appointment")
def book_appointment(appt: AppointmentBooking):
    """Book an appointment with a doctor."""
    db = database.get_db()
    try:
        doctor_id = ObjectId(appt.doctor_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid doctor ID format")
        
    doctor = db.doctors.find_one({"_id": doctor_id})
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
        
    new_appt = appt.dict()
    result = db.appointments.insert_one(new_appt)
    return {"message": "Appointment booked successfully", "appointment_id": str(result.inserted_id)}

@app.get("/appointments")
def get_appointments():
    """Fetch list of all booked appointments."""
    db = database.get_db()
    appts = list(db.appointments.find())
    return serialize_docs(appts)

@app.get("/patients")
def get_patients():
    """Fetch list of all registered patients."""
    db = database.get_db()
    patients = list(db.patients.find())
    return serialize_docs(patients)

