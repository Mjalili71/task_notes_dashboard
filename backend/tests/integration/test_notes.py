import pytest
from fastapi.testclient import TestClient

def test_get_notes_public(client):
    """Test getting notes without authentication (public)"""
    response = client.get("/notes/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_note_without_auth(client, test_note):
    """Test creating note without authentication (should fail)"""
    response = client.post("/notes/", json=test_note)
    assert response.status_code == 401

def test_create_note_with_auth(client, test_user, test_note):
    """Test creating note with authentication"""
    # Register and login
    client.post("/auth/register", json=test_user)
    login_response = client.post("/auth/login", data={
        "username": test_user["username"],
        "password": test_user["password"]
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create note
    response = client.post("/notes/", json=test_note, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == test_note["title"]
    assert data["content"] == test_note["content"]
    assert "id" in data

def test_get_note_by_id(client, test_user, test_note):
    """Test getting specific note by ID"""
    # Setup: register, login, create note
    client.post("/auth/register", json=test_user)
    login_response = client.post("/auth/login", data={
        "username": test_user["username"],
        "password": test_user["password"]
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create note
    create_response = client.post("/notes/", json=test_note, headers=headers)
    note_id = create_response.json()["id"]
    
    # Get note by ID
    response = client.get(f"/notes/{note_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == note_id
    assert data["title"] == test_note["title"]

def test_update_note(client, test_user, test_note):
    """Test updating note"""
    # Setup: register, login, create note
    client.post("/auth/register", json=test_user)
    login_response = client.post("/auth/login", data={
        "username": test_user["username"],
        "password": test_user["password"]
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create note
    create_response = client.post("/notes/", json=test_note, headers=headers)
    note_id = create_response.json()["id"]
    
    # Update note
    update_data = {
        "title": "Updated note",
        "content": "This is an updated note content"
    }
    response = client.put(f"/notes/{note_id}", json=update_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated note"
    

def test_delete_note(client, test_user, test_note):
    """Test deleting note"""
    # Setup: register, login, create note
    client.post("/auth/register", json=test_user)
    login_response = client.post("/auth/login", data={
        "username": test_user["username"],
        "password": test_user["password"]
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create note
    create_response = client.post("/notes/", json=test_note, headers=headers)
    note_id = create_response.json()["id"]
    
    # Delete note
    response = client.delete(f"/notes/{note_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Note deleted successfully"
    
    # Verify note is deleted
    get_response = client.get(f"/notes/{note_id}")
    assert get_response.status_code == 404