# Backend API Structure for zavolah

This document outlines the backend API structure and implementation for the zavolah energy marketplace platform.

## API Endpoints Overview

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/verify-email` - Email verification

### User Management
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `POST /users/change-password` - Change password

### Products
- `GET /products` - List products
- `POST /products` - Create product (sellers only)
- `GET /products/{id}` - Get product details
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Orders
- `POST /orders` - Create order
- `GET /orders` - List user orders
- `GET /orders/{id}` - Get order details
- `PUT /orders/{id}/status` - Update order status

### Payments
- `POST /payments/initialize` - Initialize payment
- `POST /payments/verify` - Verify payment
- `GET /payments/history` - Payment history

### Staff Management
- `POST /staff/codes/generate` - Generate staff codes
- `POST /staff/register` - Register with staff code
- `GET /staff/codes` - List staff codes

## Environment Variables

```bash
# Database Configuration
DATABASE_URL=your_database_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30

# Admin Configuration
ADMIN_REGISTRATION_CODE=your_admin_code

# SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
BREVO_API_KEY=your_brevo_api_key

# Payment Configuration
ONEAPP_SECRET_KEY=your_oneapp_secret_key
ONEAPP_PUBLIC_KEY=your_oneapp_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security
CORS_ORIGINS=["http://localhost:5173", "https://zavolah.com"]
```

## Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts and authentication
- `products` - Product listings
- `orders` - Order management
- `payments` - Payment transactions
- `staff_codes` - Staff registration codes
- `zavcharge_subscriptions` - ZavCharge network subscriptions

## Implementation Notes

- All API endpoints require proper authentication except registration and login
- Role-based access control is implemented for different user types
- Input validation using Pydantic models
- Comprehensive error handling and logging
- Rate limiting to prevent abuse
- CORS configuration for frontend integration

For detailed implementation, see the backend/ directory.
