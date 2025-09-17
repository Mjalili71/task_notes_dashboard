from fastapi import FastAPI
#from app.api import tasks

app = FastAPI(title="Task Notes Dashboard")

# Root endpoint
@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Task Notes Dashboard API is running!"}

# Health check endpoint  
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "message": "API is operational"}

# Include tasks router
#app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
