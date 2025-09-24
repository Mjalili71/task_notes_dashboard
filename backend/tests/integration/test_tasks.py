import pytest
from fastapi.testclient import TestClient

def test_get_tasks_public(client):
    """Test getting tasks without authentication (public)"""
    response = client.get("/tasks/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_task_without_auth(client, test_task):
    """Test creating task without authentication (should fail)"""
    response = client.post("/tasks/", json=test_task)
    assert response.status_code == 401

def test_create_task_with_auth(client, test_user, test_task):
    """Test creating task with authentication"""
    # Register and login
    client.post("/auth/register", json=test_user)
    login_response = client.post("/auth/login", data={
        "username": test_user["username"],
        "password": test_user["password"]
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create task
    response = client.post("/tasks/", json=test_task, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == test_task["title"]
    assert data["description"] == test_task["description"]
    assert data["completed"] == test_task["completed"]
    assert data["priority"] == test_task["priority"]
    assert "id" in data

def test_get_task_by_id(client, test_user, test_task):
    """Test getting specific task by ID"""
    # Setup: register, login, create task
    client.post("/auth/register", json=test_user)
    login_response = client.post("/auth/login", data={
        "username": test_user["username"],
        "password": test_user["password"]
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create task
    create_response = client.post("/tasks/", json=test_task, headers=headers)
    task_id = create_response.json()["id"]
    
    # Get task by ID
    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == test_task["title"]

def test_update_task(client, test_user, test_task):
    """Test updating task"""
    # Setup: register, login, create task
    client.post("/auth/register", json=test_user)
    login_response = client.post("/auth/login", data={
        "username": test_user["username"],
        "password": test_user["password"]
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create task
    create_response = client.post("/tasks/", json=test_task, headers=headers)
    task_id = create_response.json()["id"]
    
    # Update task
    update_data = {"title": "Updated Task", "completed": True}
    response = client.put(f"/tasks/{task_id}", json=update_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Task"
    assert data["completed"] == True

def test_delete_task(client, test_user, test_task):
    """Test deleting task"""
    # Setup: register, login, create task
    client.post("/auth/register", json=test_user)
    login_response = client.post("/auth/login", data={
        "username": test_user["username"],
        "password": test_user["password"]
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create task
    create_response = client.post("/tasks/", json=test_task, headers=headers)
    task_id = create_response.json()["id"]
    
    # Delete task
    response = client.delete(f"/tasks/{task_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Task deleted successfully"
    
    # Verify task is deleted
    get_response = client.get(f"/tasks/{task_id}")
    assert get_response.status_code == 404