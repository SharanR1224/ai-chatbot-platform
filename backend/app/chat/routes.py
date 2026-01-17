from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Project, Message
from .schemas import ChatRequest, ChatResponse
from ..auth.auth import get_current_user
import requests
from ..core.config import OPENROUTER_API_KEY, OPENROUTER_URL


router = APIRouter(prefix="/chat", tags=["Chat"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/{project_id}", response_model=ChatResponse)
def chat_with_project(
    project_id: int,
    data: ChatRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # save user message
    user_msg = Message(role="user", content=data.message, project_id=project.id)
    db.add(user_msg)
    db.commit()

    # build conversation
    messages = [
        {"role": "system", "content": project.system_prompt}
    ]

    history = db.query(Message).filter(
        Message.project_id == project.id
    ).order_by(Message.created_at).all()

    for msg in history:
        messages.append({"role": msg.role, "content": msg.content})

    messages.append({"role": "user", "content": data.message})

    print("DEBUG OPENROUTER KEY:", OPENROUTER_API_KEY)

    headers = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://ai-chatbot-platform.onrender.com",
    "X-Title": "AI Chatbot Platform"
}




    payload = {
        "model": "mistralai/mistral-7b-instruct",
        "messages": messages
    }

    response = requests.post(OPENROUTER_URL, headers=headers, json=payload)
    result = response.json()

    if "choices" not in result:
        print("OPENROUTER ERROR:", result)
        raise HTTPException(status_code=500, detail=str(result))

    bot_reply = result["choices"][0]["message"]["content"]

    bot_msg = Message(role="assistant", content=bot_reply, project_id=project.id)
    db.add(bot_msg)
    db.commit()

    return {"reply": bot_reply}


@router.get("/{project_id}")
def get_chat_history(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    messages = db.query(Message).filter(
        Message.project_id == project.id
    ).order_by(Message.created_at).all()

    return messages
