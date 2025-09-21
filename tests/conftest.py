import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from app.db import get_db, Base

# Test database URL (separate from main database)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Create test engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

# Create test session
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db dependency for testing
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session")
def client():
    """Create test client"""
    # Create test tables
    Base.metadata.create_all(bind=engine)
    
    with TestClient(app) as test_client:
        yield test_client
    
    # Clean up test database
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("test.db"):
        os.remove("test.db")

@pytest.fixture
def test_user():
    """Test user data"""
    return {
        "username": "testuser",
        "email": "test@example.com", 
        "password": "testpass123"
    }

@pytest.fixture
def test_task():
    """Test task data"""
    return {
        "title": "Test Task",
        "description": "This is a test task",
        "completed": False,
        "priority": "medium"
    }

@pytest.fixture
def test_note():
    """Test note data"""
    return {
        "title": "Test Note",
        "content": "This is a test note content"
    }