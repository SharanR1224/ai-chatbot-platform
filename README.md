# 🤖 AI Chatbot Platform

A multi-user chatbot platform built with FastAPI, React, and OpenRouter.

Users can:
- Register & login
- Create chatbot projects
- Chat with real AI models
- Store chat history per project

---

## 🚀 Tech Stack

Backend:
- FastAPI
- SQLite
- SQLAlchemy
- JWT Authentication
- OpenRouter API

Frontend:
- React (Vite)
- Fetch API
- Custom UI

---

## ⚙️ Local Setup

### 1. Clone repo
git clone <your-repo-url>
cd chatbot-platform

### 2. Backend setup
cd backend  
python -m venv venv  
venv\Scripts\activate  
pip install -r requirements.txt  

Create `.env` file in backend:
OPENROUTER_API_KEY=your_key_here  
OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions  

Run backend:
python -m uvicorn app.main:app --reload

Backend runs on: http://127.0.0.1:8000

---

### 3. Frontend setup
cd frontend  
npm install  
npm run dev  

Frontend runs on: http://localhost:5173

---

## 🌐 Live Demo

Frontend: <your-vercel-url>  
Backend: https://chatbot-backend-pveb.onrender.com
