from fastapi import FastAPI
from app.api import tasks, notes, auth
from app.db import create_tables
# Import models to ensure they're registered with Base
from app.models import task_model, user, note_model


app = FastAPI(title="Task Notes Dashboard")

# Create database tables
#create_tables()

# Root endpoint
@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Task Notes Dashboard API is running!"}

# Health check endpoint  
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "message": "API is operational"}

# Include tasks router
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(notes.router, prefix="/notes", tags=["Notes"])   
app.include_router(auth.router, prefix="/auth", tags=["Auth"])