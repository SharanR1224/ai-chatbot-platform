from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine
from .auth.routes import router as auth_router
from .projects.routes import router as project_router
from .chat.routes import router as chat_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# 🔥 CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(project_router)
app.include_router(chat_router)

@app.get("/")
def root():
    return {"message": "Chatbot Platform API running"}

