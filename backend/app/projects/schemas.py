from pydantic import BaseModel

class ProjectCreate(BaseModel):
    name: str
    system_prompt: str | None = "You are a helpful AI assistant."

class ProjectOut(BaseModel):
    id: int
    name: str
    system_prompt: str

    class Config:
        from_attributes = True
