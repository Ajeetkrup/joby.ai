# Project Walkthrough

## Overview
This project is a full-stack application with a FastAPI backend and a React frontend. It features JWT authentication, MongoDB integration, and a modern UI with animations.

## Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB Atlas Account

## Setup Instructions

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   - Rename `.env.example` to `.env`.
   - Open `.env` and paste your **MongoDB Connection String**.
   - (Optional) Change the `SECRET_KEY`.

5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will start at `http://localhost:8000`.

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`.

## Verification
1. Open `http://localhost:5173` in your browser.
2. You should be redirected to `/login`.
3. Click "Sign up" to create a new account.
4. Enter your details. If successful, you will be logged in and redirected to `/dashboard`.
5. The dashboard is a protected route that fetches your user details from the backend.

## Troubleshooting
- **CORS Errors**: Ensure the backend is running on port 8000 and the frontend on port 5173. If ports differ, update `origins` in `backend/main.py`.
- **MongoDB Connection**: Ensure your IP is whitelisted in MongoDB Atlas and the connection string is correct.
