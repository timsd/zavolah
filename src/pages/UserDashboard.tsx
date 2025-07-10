import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, ShoppingBag, GraduationCap, Zap, Store, BookOpen, Settings, LogOut, Crown, Shield, BarChart3 } from 'lucide-react'
import Header from '../components/layout/Header'
import { useTheme } from '@/contexts/ThemeContext'

// Mock user data - in real app, this would come from authentication context
const mockUser = {
  id: 'usr_001',
  name: 'John Adebayo',
  email: 'john.adebayo@example.com',
  phone: '+234 803 123 4567',
  avatar: null,
  roles: ['USER', 'SELLER'], // Can have multiple roles
  primaryRole: 'USER',
  joinedDate: '2024-01-15',
  verificationStatus: 'verified',
  stats: {
    totalPurchases: 15,
    totalSpent: 125000,
    coursesCompleted: 3,
    chargingSessions: 8,
    productsSold: 12
  }
}

const roleConfig = {
  USER: {
    name: 'Customer',
    icon: User,
    color: 'bg-blue-500',
    description: 'Browse and purchase products',
    dashboardPath: '/buyer-dashboard'
  },
  SELLER: {
    name: 'Seller',
    icon: Store,
    color: 'bg-green-500',
    description: 'Manage your marketplace store',
    dashboardPath: '/seller-dashboard'
  },
  STUDENT: {
    name: 'Student',
    icon: GraduationCap,
    color: 'bg-purple-500',
    description: 'Access courses and learning materials',
    dashboardPath: '/student-dashboard'
  },
  STAFF: {
    name: 'Staff',
    icon: Shield,
    color: 'bg-orange-500',
    description: 'Staff tools and management',
    dashboardPath: '/staff-dashboard'
  },
  ADMIN: {
    name: 'Administrator',
    icon: Crown,
    color: 'bg-red-500',
    description: 'Full system administration',
    dashboardPath: '/admin-dashboard'
  }
}

export default function UserDashboard() {
  const { isDarkMode } = useTheme()
  const [selectedRole, setSelectedRole] = useState(mockUser.primaryRole)

  const handleRoleSwitch = (role: string) => {
    setSelectedRole(role)
    // In real app, update user context and redirect
    window.location.href = roleConfig[role as keyof typeof roleConfig].dashboardPath
  }

  const handleLogout = () => {
    // In real app, clear authentication and redirect
    window.location.href = '/login'
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* User Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={mockUser.avatar || ''} />
                  <AvatarFallback className="text-lg">
                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                    <Badge variant={mockUser.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                      {mockUser.verificationStatus === 'verified' ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{mockUser.email}</p>
                  <p className="text-sm text-gray-500">Member since {new Date(mockUser.joinedDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Your Dashboard</CardTitle>
              <CardDescription>Choose which role dashboard you'd like to access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockUser.roles.map((role) => {
                  const config = roleConfig[role as keyof typeof roleConfig]
                  const Icon = config.icon
                  
                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                        selectedRole === role 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg ${config.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold">{config.name}</h3>
                          {role === mockUser.primaryRole && (
                            <Badge variant="secondary" className="text-xs">Primary</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 text-left">{config.description}</p>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{mockUser.stats.totalPurchases}</div>
                    <p className="text-sm text-gray-600">Total Purchases</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{mockUser.stats.coursesCompleted}</div>
                    <p className="text-sm text-gray-600">Courses Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Zap className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{mockUser.stats.chargingSessions}</div>
                    <p className="text-sm text-gray-600">Charging Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {mockUser.roles.includes('SELLER') && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold">{mockUser.stats.productsSold}</div>
                      <p className="text-sm text-gray-600">Products Sold</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Activity */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingBag className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">Purchased 2 items from TechHub Store</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">Completed charging session at VI Station</p>
                    <p className="text-sm text-gray-600">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">Completed "Digital Marketing Basics" course</p>
                    <p className="text-sm text-gray-600">3 days ago</p>
                  </div>
                </div>

                {mockUser.roles.includes('SELLER') && (
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Store className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">Sold "Wireless Headphones" to customer</p>
                      <p className="text-sm text-gray-600">5 days ago</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <ShoppingBag className="h-6 w-6 mb-2" />
                  Browse Store
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BookOpen className="h-6 w-6 mb-2" />
                  My Courses
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Zap className="h-6 w-6 mb-2" />
                  Find Charging
                </Button>
                <Button variant="outline" className="h-20 flex-col" onClick={handleLogout}>
                  <LogOut className="h-6 w-6 mb-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
