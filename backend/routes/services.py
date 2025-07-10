from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

router = APIRouter()

# Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

class ServiceCreate(BaseModel):
    name: str
    description: str
    category: str
    price: float
    duration: int
    requirements: Optional[List[str]] = None
    available_slots: Optional[Dict[str, List[str]]] = None

class ServiceResponse(BaseModel):
    id: str
    name: str
    description: str
    category: str
    price: float
    duration: int
    requirements: Optional[List[str]]
    available_slots: Optional[Dict[str, List[str]]]
    is_active: bool
    created_at: str
    updated_at: str

class BookingCreate(BaseModel):
    user_id: str
    service_id: str
    preferred_date: str
    preferred_time: str
    notes: Optional[str] = None
    contact_info: Dict[str, str]

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    assigned_staff: Optional[str] = None
    actual_date: Optional[str] = None
    actual_time: Optional[str] = None
    completion_notes: Optional[str] = None

class BookingResponse(BaseModel):
    id: str
    user_id: str
    service_id: str
    preferred_date: str
    preferred_time: str
    actual_date: Optional[str]
    actual_time: Optional[str]
    status: str
    payment_status: str
    assigned_staff: Optional[str]
    notes: Optional[str]
    completion_notes: Optional[str]
    contact_info: Dict[str, str]
    created_at: str
    updated_at: str

class ReviewCreate(BaseModel):
    booking_id: str
    user_id: str
    rating: int
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: str
    booking_id: str
    user_id: str
    rating: int
    comment: Optional[str]
    created_at: str
    updated_at: str

@router.get("/", response_model=List[ServiceResponse])
async def get_services(
    category: Optional[str] = None,
    is_active: Optional[bool] = None,
    limit: int = 50,
    offset: int = 0
):
    """Get services with filtering"""
    try:
        query = supabase.table("services").select("*")
        
        if category:
            query = query.eq("category", category)
        if is_active is not None:
            query = query.eq("is_active", is_active)
        
        response = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(service_id: str):
    """Get service by ID"""
    try:
        response = supabase.table("services").select("*").eq("id", service_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Service not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=ServiceResponse)
async def create_service(service: ServiceCreate):
    """Create new service"""
    try:
        response = supabase.table("services").insert({
            "name": service.name,
            "description": service.description,
            "category": service.category,
            "price": service.price,
            "duration": service.duration,
            "requirements": service.requirements,
            "available_slots": service.available_slots,
            "is_active": True
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{service_id}", response_model=ServiceResponse)
async def update_service(service_id: str, service: ServiceCreate):
    """Update service"""
    try:
        response = supabase.table("services").update({
            "name": service.name,
            "description": service.description,
            "category": service.category,
            "price": service.price,
            "duration": service.duration,
            "requirements": service.requirements,
            "available_slots": service.available_slots
        }).eq("id", service_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Service not found")
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{service_id}")
async def delete_service(service_id: str):
    """Delete service"""
    try:
        response = supabase.table("services").update({"is_active": False}).eq("id", service_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Service not found")
        
        return {"message": "Service deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/bookings/", response_model=BookingResponse)
async def create_booking(booking: BookingCreate):
    """Create new booking"""
    try:
        response = supabase.table("bookings").insert({
            "user_id": booking.user_id,
            "service_id": booking.service_id,
            "preferred_date": booking.preferred_date,
            "preferred_time": booking.preferred_time,
            "notes": booking.notes,
            "contact_info": booking.contact_info,
            "status": "pending",
            "payment_status": "pending"
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bookings/", response_model=List[BookingResponse])
async def get_bookings(
    user_id: Optional[str] = None,
    service_id: Optional[str] = None,
    status: Optional[str] = None,
    assigned_staff: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    """Get bookings with filtering"""
    try:
        query = supabase.table("bookings").select("*")
        
        if user_id:
            query = query.eq("user_id", user_id)
        if service_id:
            query = query.eq("service_id", service_id)
        if status:
            query = query.eq("status", status)
        if assigned_staff:
            query = query.eq("assigned_staff", assigned_staff)
        
        response = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: str):
    """Get booking by ID"""
    try:
        response = supabase.table("bookings").select("*").eq("id", booking_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking(booking_id: str, booking: BookingUpdate):
    """Update booking"""
    try:
        update_data = {k: v for k, v in booking.dict().items() if v is not None}
        
        response = supabase.table("bookings").update(update_data).eq("id", booking_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/bookings/{booking_id}")
async def cancel_booking(booking_id: str):
    """Cancel booking"""
    try:
        response = supabase.table("bookings").update({"status": "cancelled"}).eq("id", booking_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        return {"message": "Booking cancelled successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/bookings/{booking_id}/confirm")
async def confirm_booking(booking_id: str, staff_id: str, actual_date: str, actual_time: str):
    """Confirm booking with staff assignment"""
    try:
        response = supabase.table("bookings").update({
            "status": "confirmed",
            "assigned_staff": staff_id,
            "actual_date": actual_date,
            "actual_time": actual_time
        }).eq("id", booking_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        return {"message": "Booking confirmed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/bookings/{booking_id}/complete")
async def complete_booking(booking_id: str, completion_notes: Optional[str] = None):
    """Mark booking as completed"""
    try:
        response = supabase.table("bookings").update({
            "status": "completed",
            "completion_notes": completion_notes
        }).eq("id", booking_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        return {"message": "Booking completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reviews/", response_model=ReviewResponse)
async def create_review(review: ReviewCreate):
    """Create service review"""
    try:
        # Check if booking exists and is completed
        booking_response = supabase.table("bookings").select("*").eq("id", review.booking_id).single().execute()
        
        if not booking_response.data:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        booking = booking_response.data
        
        if booking["status"] != "completed":
            raise HTTPException(status_code=400, detail="Cannot review incomplete booking")
        
        if booking["user_id"] != review.user_id:
            raise HTTPException(status_code=403, detail="Not authorized to review this booking")
        
        response = supabase.table("service_reviews").insert({
            "booking_id": review.booking_id,
            "user_id": review.user_id,
            "rating": review.rating,
            "comment": review.comment
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reviews/", response_model=List[ReviewResponse])
async def get_reviews(
    service_id: Optional[str] = None,
    user_id: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    """Get service reviews"""
    try:
        query = supabase.table("service_reviews").select("*")
        
        if service_id:
            # Join with bookings to filter by service
            query = query.select("*, bookings!inner(service_id)").eq("bookings.service_id", service_id)
        
        if user_id:
            query = query.eq("user_id", user_id)
        
        response = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reviews/{review_id}", response_model=ReviewResponse)
async def get_review(review_id: str):
    """Get review by ID"""
    try:
        response = supabase.table("service_reviews").select("*").eq("id", review_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Review not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
async def get_service_categories():
    """Get available service categories"""
    try:
        response = supabase.table("services").select("category").execute()
        categories = list(set([item["category"] for item in response.data]))
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{service_id}/availability")
async def get_service_availability(service_id: str, date: str):
    """Get service availability for a specific date"""
    try:
        # Get service details
        service_response = supabase.table("services").select("*").eq("id", service_id).single().execute()
        
        if not service_response.data:
            raise HTTPException(status_code=404, detail="Service not found")
        
        service = service_response.data
        available_slots = service.get("available_slots", {})
        
        # Get day of week
        date_obj = datetime.strptime(date, "%Y-%m-%d")
        day_of_week = date_obj.strftime("%A").lower()
        
        # Get slots for the day
        day_slots = available_slots.get(day_of_week, [])
        
        # Get existing bookings for the date
        bookings = supabase.table("bookings").select("preferred_time, actual_time").eq("service_id", service_id).or_(f"preferred_date.eq.{date},actual_date.eq.{date}").execute()
        
        # Remove booked slots
        booked_times = []
        for booking in bookings.data:
            if booking.get("actual_time"):
                booked_times.append(booking["actual_time"])
            else:
                booked_times.append(booking["preferred_time"])
        
        available_times = [slot for slot in day_slots if slot not in booked_times]
        
        return {
            "date": date,
            "available_times": available_times,
            "duration": service["duration"],
            "price": service["price"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{service_id}/stats")
async def get_service_stats(service_id: str):
    """Get service statistics"""
    try:
        # Get booking stats
        bookings = supabase.table("bookings").select("*").eq("service_id", service_id).execute()
        
        total_bookings = len(bookings.data)
        completed_bookings = len([b for b in bookings.data if b["status"] == "completed"])
        pending_bookings = len([b for b in bookings.data if b["status"] == "pending"])
        cancelled_bookings = len([b for b in bookings.data if b["status"] == "cancelled"])
        
        # Get review stats
        reviews = supabase.table("service_reviews").select("rating, bookings!inner(service_id)").eq("bookings.service_id", service_id).execute()
        
        total_reviews = len(reviews.data)
        average_rating = sum([r["rating"] for r in reviews.data]) / total_reviews if total_reviews > 0 else 0
        
        return {
            "total_bookings": total_bookings,
            "completed_bookings": completed_bookings,
            "pending_bookings": pending_bookings,
            "cancelled_bookings": cancelled_bookings,
            "completion_rate": (completed_bookings / total_bookings * 100) if total_bookings > 0 else 0,
            "total_reviews": total_reviews,
            "average_rating": round(average_rating, 1)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}/bookings", response_model=List[BookingResponse])
async def get_user_bookings(user_id: str, limit: int = 50, offset: int = 0):
    """Get user's bookings"""
    try:
        response = supabase.table("bookings").select("*").eq("user_id", user_id).range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/staff/{staff_id}/bookings", response_model=List[BookingResponse])
async def get_staff_bookings(staff_id: str, limit: int = 50, offset: int = 0):
    """Get staff's assigned bookings"""
    try:
        response = supabase.table("bookings").select("*").eq("assigned_staff", staff_id).range(offset, offset + limit - 1).order("actual_date", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
