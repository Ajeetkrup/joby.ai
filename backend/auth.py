import os
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

from database import users_collection

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "unsafe_secret_key_for_dev")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _pre_hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def hash_password(password: str) -> str:
    pre_hashed = _pre_hash_password(password)
    return pwd_context.hash(pre_hashed)

def verify_password(plain: str, hashed: str) -> bool:
    pre_hashed = _pre_hash_password(plain)
    return pwd_context.verify(pre_hashed, hashed)

def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_user_by_email(email: str) -> Optional[dict]:
    return await users_collection.find_one({"email": email})

async def get_user_by_username(username: str) -> Optional[dict]:
    return await users_collection.find_one({"username": username})

async def authenticate_user(username: str, password: str) -> Optional[dict]:
    user = await get_user_by_username(username)
    if not user or not verify_password(password, user["hashed_password"]):
        return None
    return user
