from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    staff_code: Optional[str] = None

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    staff_code: Optional[str] = None
    role: Optional[str] = "customer"

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Login user with email and password"""
    try:
        # Sign in with Supabase
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        if not response.user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Get user profile
        user_profile = supabase.table("users").select("*").eq("id", response.user.id).single().execute()
        
        return AuthResponse(
            access_token=response.session.access_token,
            token_type="bearer",
            user={
                "id": response.user.id,
                "email": response.user.email,
                "name": user_profile.data.get("name", ""),
                "role": user_profile.data.get("role", "customer"),
                "avatar": user_profile.data.get("avatar"),
                "staff_code": user_profile.data.get("staff_code")
            }
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    """Register new user"""
    try:
        # Sign up with Supabase
        response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password
        })
        
        if not response.user:
            raise HTTPException(status_code=400, detail="Registration failed")
        
        # Create user profile
        user_profile = supabase.table("users").insert({
            "id": response.user.id,
            "email": request.email,
            "name": request.name,
            "role": request.role,
            "staff_code": request.staff_code
        }).execute()
        
        return AuthResponse(
            access_token=response.session.access_token if response.session else "",
            token_type="bearer",
            user={
                "id": response.user.id,
                "email": response.user.email,
                "name": request.name,
                "role": request.role,
                "staff_code": request.staff_code
            }
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/logout")
async def logout():
    """Logout user"""
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
async def get_current_user():
    """Get current user info"""
    try:
        user = supabase.auth.get_user()
        if not user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        # Get user profile
        profile = supabase.table("users").select("*").eq("id", user.id).single().execute()
        
        return {
            "id": user.id,
            "email": user.email,
            "name": profile.data.get("name", ""),
            "role": profile.data.get("role", "customer"),
            "avatar": profile.data.get("avatar"),
            "staff_code": profile.data.get("staff_code")
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
