from pymongo import MongoClient
import os

# Default to localhost if no environment variable is provided
MONGODB_URL = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "medicare_db"

client = MongoClient("mongodb+srv://kanija:kanija1234@kanija.fkea9cz.mongodb.net/?appName=medicare")
db = client["medicare"]

def get_db():
    return db

