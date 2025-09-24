import pytest
from fastapi.testclient import TestClient

def test_health_check(client):
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "message": "API is operational"}

def test_register_user(client, test_user):
    """Test user registration"""
    response = client.post("/auth/register", json=test_user)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == test_user["username"]
    assert data["email"] == test_user["email"]
    assert "id" in data
    # Password should not be in response
    assert "password" not in data

def test_register_duplicate_user(client, test_user):
    """Test registering duplicate user"""
    # Register first time
    client.post("/auth/register", json=test_user)
    
    # Try to register again
    response = client.post("/auth/register", json=test_user)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_user(client, test_user):
    """Test user login"""
    # First register user
    client.post("/auth/register", json=test_user)
    
    # Then login
    login_data = {
        "username": test_user["username"],
        "password": test_user["password"]
    }
    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client, test_user):
    """Test login with wrong password"""
    # Register user
    client.post("/auth/register", json=test_user)
    
    # Try login with wrong password
    login_data = {
        "username": test_user["username"],
        "password": "wrongpassword"
    }
    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 401

def test_get_current_user(client, test_user):
    """Test getting current user info"""
    # Register and login
    client.post("/auth/register", json=test_user)
    login_response = client.post("/auth/login", data={
        "username": test_user["username"],
        "password": test_user["password"]
    })
    token = login_response.json()["access_token"]
    
    # Get user info with token
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == test_user["username"]