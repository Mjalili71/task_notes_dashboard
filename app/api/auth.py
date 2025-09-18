from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db import get_db
from app.services.auth_service import AuthService
from app.schemas.user_schemas import UserCreate, UserResponse, UserLogin, Token
from app.utils.auth import verify_token

router = APIRouter()

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    """
    user = AuthService.register_user(db, user_data)
    return user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login user and return access token
    Uses OAuth2PasswordRequestForm for standard login form
    """
    login_data = UserLogin(username=form_data.username, password=form_data.password)
    result = AuthService.login_user(db, login_data)
    
    return Token(
        access_token=result["access_token"],
        token_type=result["token_type"]
    )

@router.get("/me", response_model=UserResponse)
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Get current user information from JWT token
    """
    # Verify token and get username
    token_data = verify_token(token)
    
    # Get user from database
    user = AuthService.get_user_by_username(db, token_data.username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

# Dependency to get current user (for protecting endpoints)
def get_current_user_dependency(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Dependency function to get current authenticated user
    Use this to protect endpoints that require authentication
    """
    token_data = verify_token(token)
    user = AuthService.get_user_by_username(db, token_data.username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user