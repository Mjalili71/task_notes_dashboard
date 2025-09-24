from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.task_model import Task
from app.schemas.task_schemas import TaskCreate, TaskUpdate

class TaskService:
    @staticmethod
    def _get_task_by_id(db: Session, task_id: int) -> Optional[Task]:
        """Private helper method to get task by ID"""
        return db.query(Task).filter(Task.id == task_id).first()
    
    @staticmethod
    def get_task(db: Session, task_id: int) -> Optional[Task]:
        """Get a single task by ID"""
        return TaskService._get_task_by_id(db, task_id)
    
    @staticmethod
    def get_tasks(db: Session, skip: int = 0, limit: int = 100, completed: Optional[bool] = None) -> List[Task]:
        """Get all tasks with optional filtering"""
        query = db.query(Task)
        
        if completed is not None:
            query = query.filter(Task.completed == completed)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def create_task(db: Session, task: TaskCreate) -> Task:
        """Create a new task"""
        db_task = Task(**task.model_dump())
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def update_task(db: Session, task_id: int, task_update: TaskUpdate) -> Optional[Task]:
        """Update an existing task"""
        db_task = TaskService._get_task_by_id(db, task_id)
        
        if not db_task:
            return None
        
        # Update only provided fields
        update_data = task_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)
        
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def delete_task(db: Session, task_id: int) -> bool:
        """Delete a task"""
        db_task = TaskService._get_task_by_id(db, task_id)
        
        if not db_task:
            return False
        
        db.delete(db_task)
        db.commit()
        return True
