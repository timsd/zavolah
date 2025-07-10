from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
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

class OrderItem(BaseModel):
    product_id: str
    quantity: int
    price: float

class Order(BaseModel):
    user_id: str
    items: List[OrderItem]
    total: float
    payment_method: str
    shipping_address: Dict[str, Any]

class OrderResponse(BaseModel):
    id: str
    user_id: str
    total: float
    status: str
    payment_method: str
    payment_status: str
    shipping_address: Dict[str, Any]
    created_at: str
    updated_at: str

@router.post("/", response_model=OrderResponse)
async def create_order(order: Order):
    """Create new order"""
    try:
        # Create order
        order_response = supabase.table("orders").insert({
            "user_id": order.user_id,
            "total": order.total,
            "payment_method": order.payment_method,
            "shipping_address": order.shipping_address,
            "status": "pending",
            "payment_status": "pending"
        }).execute()
        
        order_id = order_response.data[0]["id"]
        
        # Create order items
        for item in order.items:
            supabase.table("order_items").insert({
                "order_id": order_id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price
            }).execute()
        
        return order_response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[OrderResponse])
async def get_orders(user_id: Optional[str] = None):
    """Get all orders or user's orders"""
    try:
        query = supabase.table("orders").select("*")
        
        if user_id:
            query = query.eq("user_id", user_id)
        
        response = query.order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str):
    """Get order by ID"""
    try:
        response = supabase.table("orders").select("*").eq("id", order_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    """Update order status"""
    try:
        response = supabase.table("orders").update({
            "status": status
        }).eq("id", order_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {"message": "Order status updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{order_id}/items")
async def get_order_items(order_id: str):
    """Get order items"""
    try:
        response = supabase.table("order_items").select("*").eq("order_id", order_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
