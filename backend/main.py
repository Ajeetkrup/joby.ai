from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated

from database import users_collection
from models import UserCreate, UserResponse, Token, TokenData, AgentQuery, AgentResponse
from auth import (
    hash_password,
    create_access_token,
    authenticate_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    SECRET_KEY,
    ALGORITHM,
)
from jose import JWTError, jwt

app = FastAPI()

@app.on_event("startup")
async def startup_db_client():
    print("[startup] Initializing database connection...")
    try:
        from database import check_db_connection
        await check_db_connection()
        print("[startup] Database initialization complete")
    except Exception as e:
        print(f"[startup] ERROR: Database connection failed - {type(e).__name__}: {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Auth API"}

# CORS
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    print(f"[get_current_user] Validating token...")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            print(f"[get_current_user] ERROR: Token missing 'sub' field")
            raise credentials_exception
        token_data = TokenData(email=email)
        print(f"[get_current_user] Token decoded for email: {email}")
    except JWTError as e:
        print(f"[get_current_user] ERROR: JWT validation failed - {e}")
        raise credentials_exception
    except Exception as e:
        print(f"[get_current_user] ERROR: Unexpected error during token decode - {e}")
        raise credentials_exception
    
    try:
        user = await users_collection.find_one({"email": token_data.email})
        if user is None:
            print(f"[get_current_user] ERROR: User not found for email: {token_data.email}")
            raise credentials_exception
        print(f"[get_current_user] User authenticated: {token_data.email}")
        return user
    except HTTPException:
        raise
    except Exception as e:
        print(f"[get_current_user] ERROR: Database error - {e}")
        raise credentials_exception

@app.post("/signup", response_model=UserResponse)
async def signup(user: UserCreate):
    print(f"[signup] Attempting signup for username: {user.username}, email: {user.email}")
    try:
        existing_email = await users_collection.find_one({"email": user.email})
        if existing_email:
            print(f"[signup] ERROR: Email already registered: {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        
        existing_username = await users_collection.find_one({"username": user.username})
        if existing_username:
            print(f"[signup] ERROR: Username already taken: {user.username}")
            raise HTTPException(status_code=400, detail="Username already taken")
        
        print(f"[signup] Hashing password (length: {len(user.password)} chars)")
        hashed_password = hash_password(user.password)
        print(f"[signup] Password hashed successfully")
        
        user_dict = user.dict()
        user_dict["hashed_password"] = hashed_password
        del user_dict["password"]
        
        result = await users_collection.insert_one(user_dict)
        new_user = await users_collection.find_one({"_id": result.inserted_id})
        
        print(f"[signup] SUCCESS: User created with ID: {result.inserted_id}")
        return UserResponse(
            id=str(new_user["_id"]),
            email=new_user["email"],
            username=new_user["username"],
            full_name=new_user.get("full_name")
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[signup] ERROR: Unexpected error - {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    print(f"[token] Login attempt for username: {form_data.username}")
    try:
        user = await authenticate_user(form_data.username, form_data.password)
        if not user:
            print(f"[token] ERROR: Authentication failed for: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        print(f"[token] User authenticated: {form_data.username}")
        access_token = create_access_token({"sub": user["email"]}, ACCESS_TOKEN_EXPIRE_MINUTES)
        print(f"[token] SUCCESS: Access token created for: {user['username']}")
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"[token] ERROR: Unexpected error - {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail="Login failed")


@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: Annotated[dict, Depends(get_current_user)]):
    print(f"[users/me] Fetching user profile for: {current_user.get('username')}")
    try:
        return UserResponse(
            id=str(current_user["_id"]),
            email=current_user["email"],
            username=current_user["username"],
            full_name=current_user.get("full_name")
        )
    except Exception as e:
        print(f"[users/me] ERROR: Failed to create response - {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch user profile")

@app.post("/generate", response_model=AgentResponse)
async def generate_document(
    agent_query: AgentQuery,
    current_user: Annotated[dict, Depends(get_current_user)]
):
    print(f"[generate] Request from user: {current_user.get('email')}")
    print(f"[generate] Query: {agent_query.query[:100]}...")
    try:
        from agent import run_agent
        output = await run_agent(agent_query.query)
        print(f"[generate] SUCCESS: Document generated for user: {current_user.get('email')}")
        return AgentResponse(
            query=agent_query.query,
            output=output,
            status="success"
        )
    except Exception as e:
        print(f"[generate] ERROR: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
