from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.services.note_service import NoteService
from app.schemas.note_schemas import NoteCreate, NoteUpdate, NoteResponse
from typing import List
from typing import Optional
from app.api.auth import get_current_user_dependency

router = APIRouter()

@router.get("/", response_model=List[NoteResponse])
def get_notes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    notes = NoteService.get_notes(db, skip, limit)
    return notes

@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):
    note = NoteService.get_note(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.post("/", response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db), current_user= Depends(get_current_user_dependency)):
    return NoteService.create_note(db, note)

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note: NoteUpdate, db: Session = Depends(get_db), current_user= Depends(get_current_user_dependency)):
    updated_note = NoteService.update_note(db, note_id, note)
    if not updated_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return updated_note

@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db), current_user= Depends(get_current_user_dependency)):
    deleted = NoteService.delete_note(db, note_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully"}

