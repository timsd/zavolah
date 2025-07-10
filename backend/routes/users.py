from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import List, Optional
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

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    avatar: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str]
    location: Optional[str]
    avatar: Optional[str]
    role: str
    referral_code: Optional[str]
    referred_by: Optional[str]
    created_at: str
    updated_at: str

@router.get("/", response_model=List[UserResponse])
async def get_users(role: Optional[str] = None, limit: int = 50, offset: int = 0):
    """Get all users with optional filtering"""
    try:
        query = supabase.table("users").select("*")
        
        if role:
            query = query.eq("role", role)
        
        response = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get user by ID"""
    try:
        response = supabase.table("users").select("*").eq("id", user_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user: UserUpdate):
    """Update user profile"""
    try:
        update_data = {k: v for k, v in user.dict().items() if v is not None}
        
        response = supabase.table("users").update(update_data).eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """Delete user account"""
    try:
        # Delete user from auth
        supabase.auth.admin.delete_user(user_id)
        
        # Delete user from users table
        response = supabase.table("users").delete().eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/referrals")
async def get_user_referrals(user_id: str):
    """Get users referred by this user"""
    try:
        response = supabase.table("users").select("*").eq("referred_by", user_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/orders")
async def get_user_orders(user_id: str, limit: int = 10, offset: int = 0):
    """Get user's orders"""
    try:
        response = supabase.table("orders").select("*").eq("user_id", user_id).range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/bookings")
async def get_user_bookings(user_id: str, limit: int = 10, offset: int = 0):
    """Get user's service bookings"""
    try:
        response = supabase.table("bookings").select("*").eq("user_id", user_id).range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{user_id}/deactivate")
async def deactivate_user(user_id: str):
    """Deactivate user account"""
    try:
        response = supabase.table("users").update({"is_active": False}).eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User deactivated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{user_id}/activate")
async def activate_user(user_id: str):
    """Activate user account"""
    try:
        response = supabase.table("users").update({"is_active": True}).eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User activated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
