from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid
import json

load_dotenv()

router = APIRouter()

# Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

class PaymentInitiate(BaseModel):
    user_id: str
    amount: float
    currency: str
    payment_method: str
    description: str
    metadata: Optional[Dict[str, Any]] = None

class PaymentResponse(BaseModel):
    id: str
    user_id: str
    amount: float
    currency: str
    payment_method: str
    status: str
    payment_intent_id: Optional[str]
    description: str
    metadata: Optional[Dict[str, Any]]
    created_at: str
    updated_at: str

class PaymentVerify(BaseModel):
    payment_id: str
    payment_intent_id: str
    status: str

class RefundRequest(BaseModel):
    payment_id: str
    amount: Optional[float] = None
    reason: str

class RefundResponse(BaseModel):
    id: str
    payment_id: str
    amount: float
    reason: str
    status: str
    refund_id: Optional[str]
    created_at: str
    updated_at: str

@router.post("/initiate", response_model=PaymentResponse)
async def initiate_payment(payment: PaymentInitiate):
    """Initialize payment"""
    try:
        # Generate payment intent ID (in real app, this would be from Stripe/PayPal)
        payment_intent_id = f"pi_{uuid.uuid4().hex[:24]}"
        
        response = supabase.table("payments").insert({
            "user_id": payment.user_id,
            "amount": payment.amount,
            "currency": payment.currency,
            "payment_method": payment.payment_method,
            "payment_intent_id": payment_intent_id,
            "description": payment.description,
            "metadata": payment.metadata,
            "status": "pending"
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify", response_model=PaymentResponse)
async def verify_payment(payment_verify: PaymentVerify):
    """Verify payment completion"""
    try:
        response = supabase.table("payments").update({
            "status": payment_verify.status
        }).eq("id", payment_verify.payment_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        # If payment successful, update related orders/bookings
        if payment_verify.status == "completed":
            await _handle_successful_payment(payment_verify.payment_id)
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def _handle_successful_payment(payment_id: str):
    """Handle successful payment completion"""
    try:
        # Get payment details
        payment_response = supabase.table("payments").select("*").eq("id", payment_id).single().execute()
        
        if not payment_response.data:
            return
        
        payment = payment_response.data
        metadata = payment.get("metadata", {})
        
        # Update order status if this is an order payment
        if metadata.get("order_id"):
            supabase.table("orders").update({
                "payment_status": "completed",
                "status": "confirmed"
            }).eq("id", metadata["order_id"]).execute()
        
        # Update booking status if this is a booking payment
        if metadata.get("booking_id"):
            supabase.table("bookings").update({
                "payment_status": "completed",
                "status": "confirmed"
            }).eq("id", metadata["booking_id"]).execute()
        
        # Update marketplace purchase if this is a marketplace payment
        if metadata.get("purchase_id"):
            supabase.table("marketplace_purchases").update({
                "payment_status": "completed",
                "status": "confirmed"
            }).eq("id", metadata["purchase_id"]).execute()
        
    except Exception as e:
        print(f"Error handling successful payment: {e}")

@router.get("/", response_model=List[PaymentResponse])
async def get_payments(
    user_id: Optional[str] = None,
    status: Optional[str] = None,
    payment_method: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    """Get payments with filtering"""
    try:
        query = supabase.table("payments").select("*")
        
        if user_id:
            query = query.eq("user_id", user_id)
        if status:
            query = query.eq("status", status)
        if payment_method:
            query = query.eq("payment_method", payment_method)
        
        response = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(payment_id: str):
    """Get payment by ID"""
    try:
        response = supabase.table("payments").select("*").eq("id", payment_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refund", response_model=RefundResponse)
async def create_refund(refund: RefundRequest):
    """Create payment refund"""
    try:
        # Get payment details
        payment_response = supabase.table("payments").select("*").eq("id", refund.payment_id).single().execute()
        
        if not payment_response.data:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        payment = payment_response.data
        
        # Determine refund amount
        refund_amount = refund.amount if refund.amount else payment["amount"]
        
        # Generate refund ID (in real app, this would be from payment processor)
        refund_id = f"re_{uuid.uuid4().hex[:24]}"
        
        response = supabase.table("refunds").insert({
            "payment_id": refund.payment_id,
            "amount": refund_amount,
            "reason": refund.reason,
            "refund_id": refund_id,
            "status": "pending"
        }).execute()
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/refunds/", response_model=List[RefundResponse])
async def get_refunds(
    payment_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    """Get refunds with filtering"""
    try:
        query = supabase.table("refunds").select("*")
        
        if payment_id:
            query = query.eq("payment_id", payment_id)
        if status:
            query = query.eq("status", status)
        
        response = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/refunds/{refund_id}")
async def update_refund_status(refund_id: str, status: str):
    """Update refund status"""
    try:
        response = supabase.table("refunds").update({
            "status": status
        }).eq("id", refund_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Refund not found")
        
        return {"message": "Refund status updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    try:
        payload = await request.body()
        event = json.loads(payload)
        
        # Handle different event types
        if event["type"] == "payment_intent.succeeded":
            await _handle_payment_success(event["data"]["object"])
        elif event["type"] == "payment_intent.payment_failed":
            await _handle_payment_failure(event["data"]["object"])
        elif event["type"] == "charge.dispute.created":
            await _handle_chargeback(event["data"]["object"])
        
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def _handle_payment_success(payment_intent):
    """Handle successful payment from webhook"""
    try:
        # Update payment status
        supabase.table("payments").update({
            "status": "completed"
        }).eq("payment_intent_id", payment_intent["id"]).execute()
        
        # Get payment to handle completion
        payment_response = supabase.table("payments").select("*").eq("payment_intent_id", payment_intent["id"]).single().execute()
        
        if payment_response.data:
            await _handle_successful_payment(payment_response.data["id"])
        
    except Exception as e:
        print(f"Error handling payment success webhook: {e}")

async def _handle_payment_failure(payment_intent):
    """Handle failed payment from webhook"""
    try:
        supabase.table("payments").update({
            "status": "failed"
        }).eq("payment_intent_id", payment_intent["id"]).execute()
        
    except Exception as e:
        print(f"Error handling payment failure webhook: {e}")

async def _handle_chargeback(charge):
    """Handle chargeback from webhook"""
    try:
        # Create chargeback record
        supabase.table("chargebacks").insert({
            "charge_id": charge["id"],
            "amount": charge["amount"],
            "reason": charge["dispute"]["reason"],
            "status": "open"
        }).execute()
        
    except Exception as e:
        print(f"Error handling chargeback webhook: {e}")

@router.get("/stats/revenue")
async def get_revenue_stats():
    """Get revenue statistics"""
    try:
        # Get all successful payments
        payments = supabase.table("payments").select("*").eq("status", "completed").execute()
        
        total_revenue = sum([p["amount"] for p in payments.data])
        total_transactions = len(payments.data)
        
        # Get refunds
        refunds = supabase.table("refunds").select("*").eq("status", "completed").execute()
        total_refunds = sum([r["amount"] for r in refunds.data])
        
        net_revenue = total_revenue - total_refunds
        
        return {
            "total_revenue": total_revenue,
            "total_transactions": total_transactions,
            "total_refunds": total_refunds,
            "net_revenue": net_revenue,
            "average_transaction": total_revenue / total_transactions if total_transactions > 0 else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/methods")
async def get_payment_methods():
    """Get available payment methods"""
    return {
        "methods": [
            {"id": "card", "name": "Credit/Debit Card", "enabled": True},
            {"id": "paypal", "name": "PayPal", "enabled": True},
            {"id": "bank_transfer", "name": "Bank Transfer", "enabled": True},
            {"id": "mobile_money", "name": "Mobile Money", "enabled": True}
        ]
    }

@router.get("/user/{user_id}/history", response_model=List[PaymentResponse])
async def get_user_payment_history(user_id: str, limit: int = 50, offset: int = 0):
    """Get user's payment history"""
    try:
        response = supabase.table("payments").select("*").eq("user_id", user_id).range(offset, offset + limit - 1).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
