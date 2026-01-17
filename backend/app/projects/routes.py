from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Project
from .schemas import ProjectCreate, ProjectOut
from ..auth.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ProjectOut)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    project = Project(
        name=data.name,
        system_prompt=data.system_prompt,
        user_id=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project



@router.get("/", response_model=list[ProjectOut])
def get_projects(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(Project).filter(Project.user_id == current_user.id).all()
