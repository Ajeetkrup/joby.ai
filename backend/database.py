import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import certifi

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DB_NAME", "fastapi_react_auth_db")

if not MONGODB_URL:
    print("WARNING: MONGODB_URL not found in .env file. Please set it in backend/.env")

# Using certifi to ensure we have valid CA certificates for the connection
client = AsyncIOMotorClient(MONGODB_URL, tlsCAFile=certifi.where())
db = client[DB_NAME]
users_collection = db.users

async def check_db_connection():
    try:
        await client.admin.command('ping')
        print("INFO:     Successfully connected to MongoDB Atlas!")
    except Exception as e:
        print(f"ERROR:    Could not connect to MongoDB Atlas: {e}")
