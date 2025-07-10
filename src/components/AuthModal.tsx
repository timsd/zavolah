import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { User, Mail, Lock, Eye, EyeOff, UserCheck, Building } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { login, register } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState(defaultTab)
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer', // 'customer', 'seller', 'staff'
    agreedToTerms: false,
    // Address information
    address: '',
    city: '',
    state: '',
    country: 'Nigeria'
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Admin check
      if (loginData.email === 'zavolah@gmail.com' && loginData.password === 'Ebun1993@0luwa') {
        // Create admin session
        const adminUser = {
          id: 'admin-001',
          email: 'zavolah@gmail.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          loginTime: new Date().toISOString()
        }
        
        localStorage.setItem('currentUser', JSON.stringify(adminUser))
        sessionStorage.setItem('isAuthenticated', 'true')
        
        toast({
          title: "Admin Login Successful",
          description: "Welcome back, Admin!",
        })
        
        onClose()
        window.location.href = '/admin'
        return
      }

      // Check existing users
      const users = JSON.parse(localStorage.getItem('zavolah-users') || '[]')
      const user = users.find((u: any) => u.email === loginData.email)
      
      if (!user || user.password !== loginData.password) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive"
        })
        return
      }

      // Update last login
      user.lastLogin = new Date().toISOString()
      const updatedUsers = users.map((u: any) => u.id === user.id ? user : u)
      localStorage.setItem('zavolah-users', JSON.stringify(updatedUsers))
      
      // Set current user session
      localStorage.setItem('currentUser', JSON.stringify(user))
      sessionStorage.setItem('isAuthenticated', 'true')
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.firstName}!`,
      })
      
      onClose()
      
      // Redirect based on role
      if (user.role === 'seller') {
        window.location.href = '/marketplace/become-seller'
      } else {
        window.location.href = '/marketplace/buyer-dashboard'
      }
      
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation
      if (registerData.password !== registerData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match.",
          variant: "destructive"
        })
        return
      }

      if (!registerData.agreedToTerms) {
        toast({
          title: "Terms Required",
          description: "Please agree to the terms and conditions.",
          variant: "destructive"
        })
        return
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('zavolah-users') || '[]')
      if (users.find((u: any) => u.email === registerData.email)) {
        toast({
          title: "User Exists",
          description: "An account with this email already exists.",
          variant: "destructive"
        })
        return
      }

      // Create new user
      const newUser = {
        id: 'USER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone,
        role: registerData.role,
        address: registerData.address,
        city: registerData.city,
        state: registerData.state,
        country: registerData.country,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
        orders: [],
        wishlist: [],
        preferences: {}
      }

      users.push(newUser)
      localStorage.setItem('zavolah-users', JSON.stringify(users))
      
      // Auto-login after registration
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      sessionStorage.setItem('isAuthenticated', 'true')
      
      toast({
        title: "Registration Successful",
        description: `Welcome to Zavolah, ${newUser.firstName}!`,
      })
      
      onClose()
      
      // Redirect based on role
      if (newUser.role === 'seller') {
        window.location.href = '/marketplace/become-seller'
      } else {
        window.location.href = '/marketplace/buyer-dashboard'
      }
      
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset link has been sent to your email.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Zavolah</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email Address</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="px-0"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-email">Email Address</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+234 xxx xxx xxxx"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Account Type</Label>
                <Select value={registerData.role} onValueChange={(value) => setRegisterData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer (Buyer)</SelectItem>
                    <SelectItem value="seller">Seller (Marketplace)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Create password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={registerData.agreedToTerms}
                  onCheckedChange={(checked) => setRegisterData(prev => ({ ...prev, agreedToTerms: !!checked }))}
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
