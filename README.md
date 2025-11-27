# joby.ai - AI Resume & Cover Letter Generator

An intelligent document generation platform powered by a multi-agent AI system. Built with LangGraph for orchestrating specialized AI agents, FastAPI for the backend, and React for a modern frontend experience.

![joby.ai](https://img.shields.io/badge/joby.ai-AI%20Powered-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-green?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square)

## Overview

joby.ai helps job seekers create professional resumes and cover letters using AI. Simply describe your requirements and experience, and the multi-agent system will generate polished, job-ready documents that you can edit and download as PDF or DOCX.

## Agent Architecture

The system uses a **hierarchical multi-agent architecture** built with LangGraph, where specialized agents collaborate to produce high-quality outputs.

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INPUT                               │
│          (Job requirements + Personal details)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      🔀 ROUTER AGENT                             │
│  Analyzes user intent and routes to appropriate workflow         │
│  - Determines: Resume vs Cover Letter                            │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────────┐
│   📋 RESUME WORKFLOW    │     │   ✉️ COVER LETTER WORKFLOW       │
└─────────────────────────┘     └─────────────────────────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────────┐
│  ✅ RESUME CHECK AGENT  │     │  📝 COVER LETTER WRITER AGENT   │
│  Validates required info │     │  Generates compelling letters   │
│  - Contact Info          │     │  tailored to job requirements   │
│  - Skills                │     │                                 │
│  - Experience            │     │                                 │
│  - Education             │     │                                 │
└─────────────────────────┘     └─────────────────────────────────┘
              │                               │
              ▼                               │
┌─────────────────────────┐                   │
│  📄 RESUME MAKER AGENT  │                   │
│  Creates professional   │                   │
│  formatted resume       │                   │
└─────────────────────────┘                   │
              │                               │
              └───────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      📤 FINAL OUTPUT                             │
│              (Markdown formatted document)                       │
└─────────────────────────────────────────────────────────────────┘
```

### Agent Descriptions

| Agent | Purpose |
|-------|---------|
| **Router Agent** | Analyzes user input to determine intent (resume or cover letter) and routes to the appropriate workflow |
| **Resume Check Agent** | Validates that all required information is present before generating a resume |
| **Resume Maker Agent** | Creates a professionally formatted resume based on user details and job requirements |
| **Cover Letter Writer Agent** | Generates compelling, personalized cover letters tailored to specific job positions |

## Project Structure

```
joby.ai/
├── backend/                    # FastAPI Backend
│   ├── agent.py               # LangGraph multi-agent system
│   ├── main.py                # FastAPI application & routes
│   ├── auth.py                # JWT authentication logic
│   ├── database.py            # MongoDB connection (Motor)
│   ├── models.py              # Pydantic models
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js       # API client configuration
│   │   ├── components/
│   │   │   ├── Button.jsx     # Reusable button component
│   │   │   ├── Input.jsx      # Form input component
│   │   │   └── RichTextEditor.jsx  # TipTap editor
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Authentication state
│   │   │   └── ThemeContext.jsx   # Dark/light theme
│   │   ├── pages/
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Signup.jsx     # Registration page
│   │   │   ├── Generate.jsx   # Main generation page
│   │   │   └── Editor.jsx     # Document editor page
│   │   ├── index.css          # Global styles & design tokens
│   │   ├── App.jsx            # App router
│   │   └── main.jsx           # Entry point
│   └── package.json           # Node dependencies
│
└── notebooks/
    └── hierarchical_agents.ipynb  # Agent development notebook
```

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **LangGraph** - Multi-agent orchestration
- **LangChain + Groq** - LLM integration
- **MongoDB + Motor** - Async database
- **JWT** - Authentication

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **TailwindCSS 4** - Styling
- **Framer Motion** - Animations
- **TipTap** - Rich text editor
- **html2pdf.js / docx** - Document export

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB instance
- Groq API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```env
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
SECRET_KEY=your_jwt_secret_key
```

5. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/signup` | Register new user | No |
| POST | `/token` | Login & get JWT | No |
| GET | `/users/me` | Get current user | Yes |
| POST | `/generate` | Generate document | Yes |

## Features

- **AI Document Generation** - Create resumes and cover letters with AI
- **Rich Text Editor** - Edit generated content with formatting tools
- **Multi-format Export** - Download as PDF or DOCX
- **Dark/Light Theme** - Toggle between themes
- **User Authentication** - Secure JWT-based auth
- **Real-time Preview** - See changes instantly

## Environment Variables

### Backend (.env)
```
GROQ_API_KEY=        # Groq API key for LLM
MONGODB_URI=         # MongoDB connection string
SECRET_KEY=          # JWT secret key
ALGORITHM=HS256      # JWT algorithm
```

## License

MIT License

---

Built with ❤️ by Ajeet Upadhyay

