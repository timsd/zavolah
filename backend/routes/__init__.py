# Routes package

from .auth import router as auth_router
from .products import router as products_router
from .orders import router as orders_router
from .users import router as users_router
from .marketplace import router as marketplace_router
from .staff import router as staff_router
from .referrals import router as referrals_router
from .payments import router as payments_router
from .chat import router as chat_router
from .services import router as services_router

__all__ = [
    "auth_router",
    "products_router", 
    "orders_router",
    "users_router",
    "marketplace_router",
    "staff_router",
    "referrals_router",
    "payments_router",
    "chat_router",
    "services_router"
]
