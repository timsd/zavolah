from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
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

class Product(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    price: float
    category: str
    image: str
    in_stock: bool = True

class ProductResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: str
    image: str
    in_stock: bool
    created_at: str
    updated_at: str

@router.get("/", response_model=List[ProductResponse])
async def get_products(category: Optional[str] = None):
    """Get all products"""
    try:
        query = supabase.table("products").select("*")
        
        if category:
            query = query.eq("category", category)
        
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """Get product by ID"""
    try:
        response = supabase.table("products").select("*").eq("id", product_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=ProductResponse)
async def create_product(product: Product):
    """Create new product"""
    try:
        response = supabase.table("products").insert({
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "category": product.category,
            "image": product.image,
            "in_stock": product.in_stock
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product: Product):
    """Update product"""
    try:
        response = supabase.table("products").update({
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "category": product.category,
            "image": product.image,
            "in_stock": product.in_stock
        }).eq("id", product_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    """Delete product"""
    try:
        response = supabase.table("products").delete().eq("id", product_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return {"message": "Product deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/category/{category}")
async def get_products_by_category(category: str):
    """Get products by category"""
    try:
        response = supabase.table("products").select("*").eq("category", category).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
