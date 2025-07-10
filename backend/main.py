from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from ably import AblyRest
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Ably configuration
ABLY_API_KEY = os.getenv("ABLY_API_KEY")
if ABLY_API_KEY:
    ably = AblyRest(ABLY_API_KEY)
else:
    logger.warning("Ably API key not found")
    ably = None

# Security
security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Zavolah API server...")
    yield
    # Shutdown
    logger.info("Shutting down Zavolah API server...")

# Create FastAPI app
app = FastAPI(
    title="Zavolah API",
    description="Backend API for Zavolah Energy Hub",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://zavolah.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication middleware
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    try:
        # Verify token with Supabase
        user = supabase.auth.get_user(credentials.credentials)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")

# Routes
@app.get("/")
async def root():
    return {"message": "Zavolah API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

# Import route modules
from routes import auth, products, orders, users, marketplace, staff, referrals, payments, chat, services

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(marketplace.router, prefix="/api/marketplace", tags=["Marketplace"])
app.include_router(staff.router, prefix="/api/staff", tags=["Staff"])
app.include_router(referrals.router, prefix="/api/referrals", tags=["Referrals"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(services.router, prefix="/api/services", tags=["Services"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
