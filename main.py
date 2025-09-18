from fastapi import FastAPI
from app.api import tasks
from app.db import create_tables
# Import models to ensure they're registered with Base
from app.models import task_model, user

app = FastAPI(title="Task Notes Dashboard")

# Create database tables
create_tables()

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
