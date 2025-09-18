from sqlalchemy.orm import Session
from app.models.note_model import Note
from app.schemas.note_schemas import NoteCreate, NoteUpdate, NoteResponse
from typing import List, Optional

class NoteService:
    @staticmethod
    def _get_note_by_id(db: Session, note_id: int) -> Optional[Note]:
        """Private helper method to get note by ID"""
        return db.query(Note).filter(Note.id == note_id).first()
    
    @staticmethod
    def get_note(db: Session, note_id: int) -> Optional[Note]:
        return NoteService._get_note_by_id(db, note_id)
    
    @staticmethod
    def get_notes(db: Session, skip: int = 0, limit: int = 100) -> List[Note]:
        return db.query(Note).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_note(db: Session, note: NoteCreate) -> Note:
        db_note = Note(**note.model_dump())
        db.add(db_note)
        db.commit()
        db.refresh(db_note)
        return db_note
    
    @staticmethod
    def update_note(db: Session, note_id: int, note_update: NoteUpdate) -> Optional[Note]:
        db_note = NoteService._get_note_by_id(db, note_id)

        if not db_note:
            return None
        
        # Update only provided fields
        update_data = note_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_note, field, value)
        
        db.commit()
        db.refresh(db_note)
        return db_note
    
    @staticmethod
    def delete_note(db: Session, note_id: int) -> bool:
        db_note = NoteService._get_note_by_id(db, note_id)
        
        if not db_note:
            return False
        
        db.delete(db_note)
        db.commit()
        return True
        