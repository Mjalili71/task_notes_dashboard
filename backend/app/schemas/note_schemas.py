from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NoteBase(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    user_id: Optional[int] = Field(None, description="User ID")

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)
    user_id: Optional[int] = Field(None, description="User ID")

class NoteResponse(NoteBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
