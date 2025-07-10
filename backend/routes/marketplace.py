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

class DesignCreate(BaseModel):
    seller_id: str
    title: str
    description: str
    price: float
    category: str
    images: List[str]
    specifications: Dict[str, Any]

class DesignResponse(BaseModel):
    id: str
    seller_id: str
    title: str
    description: str
    price: float
    category: str
    images: List[str]
    specifications: Dict[str, Any]
    status: str
    created_at: str
    updated_at: str

class SellerProfile(BaseModel):
    user_id: str
    company_name: str
    description: str
    portfolio_url: Optional[str] = None
    rating: Optional[float] = None

class PurchaseRequest(BaseModel):
    buyer_id: str
    design_id: str
    quantity: int
    customizations: Optional[Dict[str, Any]] = None

class PurchaseResponse(BaseModel):
    id: str
    buyer_id: str
    design_id: str
    quantity: int
    total_price: float
    status: str
    customizations: Optional[Dict[str, Any]]
    created_at: str
    updated_at: str

@router.get("/designs", response_model=List[DesignResponse])
async def get_designs(
    category: Optional[str] = None,
    seller_id: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    limit: int = 50,
    offset: int = 0
):
    """Get marketplace designs with filtering"""
    try:
        query = supabase.table("marketplace_designs").select("*")
        
        if category:
            query = query.eq("category", category)
        if seller_id:
            query = query.eq("seller_id", seller_id)
        if min_price:
            query = query.gte("price", min_price)
        if max_price:
            query = query.lte("price", max_price)
        
        response = query.eq("status", "active").range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/designs/{design_id}", response_model=DesignResponse)
async def get_design(design_id: str):
    """Get design by ID"""
    try:
        response = supabase.table("marketplace_designs").select("*").eq("id", design_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Design not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/designs", response_model=DesignResponse)
async def create_design(design: DesignCreate):
    """Create new marketplace design"""
    try:
        response = supabase.table("marketplace_designs").insert({
            "seller_id": design.seller_id,
            "title": design.title,
            "description": design.description,
            "price": design.price,
            "category": design.category,
            "images": design.images,
            "specifications": design.specifications,
            "status": "active"
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/designs/{design_id}", response_model=DesignResponse)
async def update_design(design_id: str, design: DesignCreate):
    """Update marketplace design"""
    try:
        response = supabase.table("marketplace_designs").update({
            "title": design.title,
            "description": design.description,
            "price": design.price,
            "category": design.category,
            "images": design.images,
            "specifications": design.specifications
        }).eq("id", design_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Design not found")
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/designs/{design_id}")
async def delete_design(design_id: str):
    """Delete marketplace design"""
    try:
        response = supabase.table("marketplace_designs").update({"status": "deleted"}).eq("id", design_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Design not found")
        
        return {"message": "Design deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sellers", response_model=List[SellerProfile])
async def get_sellers(limit: int = 50, offset: int = 0):
    """Get marketplace sellers"""
    try:
        response = supabase.table("marketplace_sellers").select("*").range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sellers/{seller_id}", response_model=SellerProfile)
async def get_seller(seller_id: str):
    """Get seller profile"""
    try:
        response = supabase.table("marketplace_sellers").select("*").eq("user_id", seller_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Seller not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sellers", response_model=SellerProfile)
async def create_seller_profile(seller: SellerProfile):
    """Create seller profile"""
    try:
        response = supabase.table("marketplace_sellers").insert({
            "user_id": seller.user_id,
            "company_name": seller.company_name,
            "description": seller.description,
            "portfolio_url": seller.portfolio_url,
            "rating": seller.rating
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/purchases", response_model=PurchaseResponse)
async def create_purchase(purchase: PurchaseRequest):
    """Create marketplace purchase"""
    try:
        # Get design details
        design_response = supabase.table("marketplace_designs").select("*").eq("id", purchase.design_id).single().execute()
        
        if not design_response.data:
            raise HTTPException(status_code=404, detail="Design not found")
        
        design = design_response.data
        total_price = design["price"] * purchase.quantity
        
        response = supabase.table("marketplace_purchases").insert({
            "buyer_id": purchase.buyer_id,
            "design_id": purchase.design_id,
            "quantity": purchase.quantity,
            "total_price": total_price,
            "customizations": purchase.customizations,
            "status": "pending"
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/purchases", response_model=List[PurchaseResponse])
async def get_purchases(buyer_id: Optional[str] = None, seller_id: Optional[str] = None, limit: int = 50, offset: int = 0):
    """Get marketplace purchases"""
    try:
        query = supabase.table("marketplace_purchases").select("*")
        
        if buyer_id:
            query = query.eq("buyer_id", buyer_id)
        if seller_id:
            # Join with designs to filter by seller
            query = query.select("*, marketplace_designs!inner(seller_id)").eq("marketplace_designs.seller_id", seller_id)
        
        response = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/purchases/{purchase_id}", response_model=PurchaseResponse)
async def get_purchase(purchase_id: str):
    """Get purchase by ID"""
    try:
        response = supabase.table("marketplace_purchases").select("*").eq("id", purchase_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Purchase not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/purchases/{purchase_id}/status")
async def update_purchase_status(purchase_id: str, status: str):
    """Update purchase status"""
    try:
        response = supabase.table("marketplace_purchases").update({"status": status}).eq("id", purchase_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Purchase not found")
        
        return {"message": "Purchase status updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
async def get_categories():
    """Get available design categories"""
    try:
        response = supabase.table("marketplace_designs").select("category").execute()
        categories = list(set([item["category"] for item in response.data]))
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
