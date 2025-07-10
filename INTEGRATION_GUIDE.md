# Frontend-Backend Integration Guide

## Quick Start Integration

### 1. Replace Mock Data with Real API Calls

#### Example: Marketplace Order Processing

**Before (Mock Implementation):**
```typescript
// src/pages/Marketplace.tsx - Line 190
const paymentResult = mockPaymentProcessing(paymentMethod, paymentAmount)
```

**After (Real Implementation):**
```typescript
// src/pages/Marketplace.tsx
import { paymentService } from '@/services/paymentService'

const paymentResult = await paymentService.initializePayment({
  amount: paymentAmount,
  currency: 'NGN',
  customerEmail: clientInfo.email,
  customerName: clientInfo.name,
  customerPhone: clientInfo.phone || '',
  description: `Design purchase: ${selectedDesign?.name}`,
  orderId: `ORDER-${Date.now()}`
})

// Redirect to payment page
paymentService.handlePaymentRedirect(paymentResult.paymentUrl)
```

#### Example: Staff Authentication

**Before (Mock Implementation):**
```typescript
// src/pages/StaffAccess.tsx - Line 131
const isValidCode = formData.staffCode === 'STAFF123'
```

**After (Real Implementation):**
```typescript
// src/pages/StaffAccess.tsx
import { useAuth } from '@/contexts/AuthContext'

const { login } = useAuth()

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    await login({
      email: formData.email,
      password: formData.password,
      staffCode: formData.staffCode
    })
    // User is automatically redirected after successful login
  } catch (error) {
    // Error handling is managed by AuthContext
  }
}
```

#### Example: Referral System

**Before (Mock Implementation):**
```typescript
// src/pages/ReferEarn.tsx - Line 205
localStorage.setItem('referralApplications', JSON.stringify(existingApplications))
```

**After (Real Implementation):**
```typescript
// src/pages/ReferEarn.tsx
import { usePost } from '@/hooks/useApi'

const { post: submitApplication } = usePost()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    const response = await submitApplication('/referrals/apply', {
      ...formData,
      referralCode: generateReferralCode(formData.fullName, formData.email)
    })
    
    // Success handling
    setStep(4)
  } catch (error) {
    // Error handling is managed by usePost hook
  }
}
```

### 2. Add Environment Variables

**Create `.env.local` file:**
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ONEAPP_PUBLIC_KEY=1applive_pb_911afb34f8da4803774010f03af52db7
VITE_CLOUDINARY_CLOUD_NAME=dr4xchzpi
```

### 3. Update Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "dev:backend": "concurrently \"npm run dev\" \"npm run backend:dev\"",
    "backend:dev": "cd backend && npm run dev",
    "build": "vite build",
    "build:full": "npm run build && cd backend && npm run build"
  }
}
```

### 4. File Upload Integration Example

**Update BecomeSeller.tsx CV upload:**
```typescript
// src/pages/BecomeSeller.tsx
import { fileUploadService } from '@/services/fileUploadService'

const handleCVUpload = async (file: File) => {
  try {
    const uploadResult = await fileUploadService.uploadCV(file)
    setFormData(prev => ({ ...prev, cvUrl: uploadResult.url }))
    
    toast({
      title: "CV Uploaded",
      description: "Your CV has been uploaded successfully"
    })
  } catch (error) {
    toast({
      title: "Upload Failed",
      description: "Failed to upload CV. Please try again.",
      variant: "destructive"
    })
  }
}
```

### 5. Real-time Chat Integration

**Update StaffCRM.tsx chat system:**
```typescript
// src/pages/StaffCRM.tsx
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const [messages, setMessages] = useState([])
const [socket, setSocket] = useState<WebSocket | null>(null)

useEffect(() => {
  // Connect to WebSocket for real-time chat
  const ws = new WebSocket('ws://localhost:3001/chat')
  setSocket(ws)
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    setMessages(prev => [...prev, message])
  }
  
  return () => ws.close()
}, [])

const handleSendMessage = async () => {
  const messageData = {
    content: chatMessage,
    roomId: isPrivateChat ? `private-${selectedPrivateUser}` : 'general',
    isPrivate: isPrivateChat,
    recipientId: isPrivateChat ? selectedPrivateUser : null
  }
  
  // Send via API
  await api.post('/chat/messages', messageData)
  
  // Also send via WebSocket for real-time updates
  if (socket) {
    socket.send(JSON.stringify(messageData))
  }
  
  setChatMessage('')
}
```

### 6. Product Management Integration

**Update Store.tsx with real product data:**
```typescript
// src/pages/Store.tsx
import { useApi } from '@/hooks/useApi'

const { data: products, loading, error } = useApi<Product[]>('/products')

if (loading) return <div>Loading products...</div>
if (error) return <div>Error loading products: {error}</div>

// Use real product data instead of mock data
const filteredProducts = products?.filter(product => {
  const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
  const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
  return matchesSearch && matchesCategory
}) || []
```

### 7. Authentication Protection

**Add protected routes:**
```typescript
// src/components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'staff' | 'customer'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  
  if (!isAuthenticated) {
    return <Navigate to="/staff" replace />
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

// Usage in App.tsx
<Route 
  path="/staff/crm" 
  element={
    <ProtectedRoute requiredRole="staff">
      <StaffCRM />
    </ProtectedRoute>
  } 
/>
```

### 8. Error Handling Enhancement

**Add global error boundary:**
```typescript
// src/components/ErrorBoundary.tsx
import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 9. Performance Optimization

**Add React Query for better API state management:**
```typescript
// src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (productData: any) => api.post('/products', productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })
}
```

### 10. Loading States and Skeletons

**Add loading skeletons:**
```typescript
// src/components/LoadingSkeleton.tsx
export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
    </div>
  )
}

// Usage in components
{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array(6).fill(0).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
) : (
  // Render actual products
)}
```

## Testing Integration

### 1. Test API Endpoints
```bash
# Start backend server
cd backend && npm run dev

# Test authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### 2. Test Frontend Integration
```bash
# Start frontend with backend
npm run dev:backend

# Visit http://localhost:3000
# Test login, product browsing, order placement
```

## Deployment Considerations

### 1. Environment Variables
- Set up production environment variables
- Use secure secrets management
- Configure CORS properly

### 2. Database Migration
- Run database migrations
- Set up production database
- Configure connection pooling

### 3. File Upload Configuration
- Configure Cloudinary for production
- Set up proper file size limits
- Implement image optimization

### 4. Payment Gateway Configuration
- Configure OneApp for production
- Set up webhook endpoints
- Test payment flows

The frontend is fully prepared for this integration and will work seamlessly once the backend endpoints are implemented!
