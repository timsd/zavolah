from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import random
import string

load_dotenv()

router = APIRouter()

# Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

class ReferralCreate(BaseModel):
    referrer_id: str
    referred_email: str
    referral_type: str
    commission_rate: float

class ReferralResponse(BaseModel):
    id: str
    referrer_id: str
    referred_user_id: Optional[str]
    referred_email: str
    referral_code: str
    referral_type: str
    status: str
    commission_rate: float
    commission_earned: float
    created_at: str
    updated_at: str

class EarningCreate(BaseModel):
    user_id: str
    referral_id: str
    amount: float
    source: str
    description: str

class EarningResponse(BaseModel):
    id: str
    user_id: str
    referral_id: str
    amount: float
    source: str
    description: str
    status: str
    created_at: str
    updated_at: str

class ReferralStats(BaseModel):
    total_referrals: int
    active_referrals: int
    pending_referrals: int
    total_earnings: float
    pending_earnings: float
    paid_earnings: float

def generate_referral_code():
    """Generate a unique referral code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

@router.get("/", response_model=List[ReferralResponse])
async def get_referrals(
    referrer_id: Optional[str] = None,
    status: Optional[str] = None,
    referral_type: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    """Get referrals with filtering"""
    try:
        query = supabase.table("referrals").select("*")
        
        if referrer_id:
            query = query.eq("referrer_id", referrer_id)
        if status:
            query = query.eq("status", status)
        if referral_type:
            query = query.eq("referral_type", referral_type)
        
        response = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{referral_id}", response_model=ReferralResponse)
async def get_referral(referral_id: str):
    """Get referral by ID"""
    try:
        response = supabase.table("referrals").select("*").eq("id", referral_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Referral not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=ReferralResponse)
async def create_referral(referral: ReferralCreate):
    """Create new referral"""
    try:
        referral_code = generate_referral_code()
        
        response = supabase.table("referrals").insert({
            "referrer_id": referral.referrer_id,
            "referred_email": referral.referred_email,
            "referral_code": referral_code,
            "referral_type": referral.referral_type,
            "commission_rate": referral.commission_rate,
            "status": "pending",
            "commission_earned": 0
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{referral_id}/approve")
async def approve_referral(referral_id: str, referred_user_id: str):
    """Approve referral when referred user signs up"""
    try:
        response = supabase.table("referrals").update({
            "referred_user_id": referred_user_id,
            "status": "active"
        }).eq("id", referral_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Referral not found")
        
        return {"message": "Referral approved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{referral_id}/complete")
async def complete_referral(referral_id: str, commission_amount: float):
    """Complete referral and calculate commission"""
    try:
        # Get referral details
        referral_response = supabase.table("referrals").select("*").eq("id", referral_id).single().execute()
        
        if not referral_response.data:
            raise HTTPException(status_code=404, detail="Referral not found")
        
        referral = referral_response.data
        earned_commission = commission_amount * (referral["commission_rate"] / 100)
        
        # Update referral
        supabase.table("referrals").update({
            "status": "completed",
            "commission_earned": earned_commission
        }).eq("id", referral_id).execute()
        
        # Create earning record
        supabase.table("referral_earnings").insert({
            "user_id": referral["referrer_id"],
            "referral_id": referral_id,
            "amount": earned_commission,
            "source": "referral_commission",
            "description": f"Commission from referral {referral['referral_code']}",
            "status": "pending"
        }).execute()
        
        return {"message": "Referral completed successfully", "commission_earned": earned_commission}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/earnings/", response_model=List[EarningResponse])
async def get_earnings(
    user_id: Optional[str] = None,
    status: Optional[str] = None,
    source: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    """Get referral earnings with filtering"""
    try:
        query = supabase.table("referral_earnings").select("*")
        
        if user_id:
            query = query.eq("user_id", user_id)
        if status:
            query = query.eq("status", status)
        if source:
            query = query.eq("source", source)
        
        response = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/earnings/{earning_id}", response_model=EarningResponse)
async def get_earning(earning_id: str):
    """Get earning by ID"""
    try:
        response = supabase.table("referral_earnings").select("*").eq("id", earning_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Earning not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/earnings/", response_model=EarningResponse)
async def create_earning(earning: EarningCreate):
    """Create new earning record"""
    try:
        response = supabase.table("referral_earnings").insert({
            "user_id": earning.user_id,
            "referral_id": earning.referral_id,
            "amount": earning.amount,
            "source": earning.source,
            "description": earning.description,
            "status": "pending"
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/earnings/{earning_id}/pay")
async def pay_earning(earning_id: str):
    """Mark earning as paid"""
    try:
        response = supabase.table("referral_earnings").update({
            "status": "paid"
        }).eq("id", earning_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Earning not found")
        
        return {"message": "Earning marked as paid"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats/{user_id}", response_model=ReferralStats)
async def get_user_referral_stats(user_id: str):
    """Get user's referral statistics"""
    try:
        # Get referral stats
        referrals = supabase.table("referrals").select("*").eq("referrer_id", user_id).execute()
        
        total_referrals = len(referrals.data)
        active_referrals = len([r for r in referrals.data if r["status"] == "active"])
        pending_referrals = len([r for r in referrals.data if r["status"] == "pending"])
        
        # Get earnings stats
        earnings = supabase.table("referral_earnings").select("*").eq("user_id", user_id).execute()
        
        total_earnings = sum([e["amount"] for e in earnings.data])
        pending_earnings = sum([e["amount"] for e in earnings.data if e["status"] == "pending"])
        paid_earnings = sum([e["amount"] for e in earnings.data if e["status"] == "paid"])
        
        return ReferralStats(
            total_referrals=total_referrals,
            active_referrals=active_referrals,
            pending_referrals=pending_referrals,
            total_earnings=total_earnings,
            pending_earnings=pending_earnings,
            paid_earnings=paid_earnings
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/code/{referral_code}")
async def get_referral_by_code(referral_code: str):
    """Get referral by code"""
    try:
        response = supabase.table("referrals").select("*").eq("referral_code", referral_code).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Referral code not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process-signup")
async def process_referral_signup(referral_code: str, new_user_id: str):
    """Process referral when new user signs up"""
    try:
        # Find referral by code
        referral_response = supabase.table("referrals").select("*").eq("referral_code", referral_code).single().execute()
        
        if not referral_response.data:
            raise HTTPException(status_code=404, detail="Invalid referral code")
        
        referral = referral_response.data
        
        # Update referral with new user ID
        supabase.table("referrals").update({
            "referred_user_id": new_user_id,
            "status": "active"
        }).eq("id", referral["id"]).execute()
        
        # Update user's referred_by field
        supabase.table("users").update({
            "referred_by": referral["referrer_id"]
        }).eq("id", new_user_id).execute()
        
        return {"message": "Referral processed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
