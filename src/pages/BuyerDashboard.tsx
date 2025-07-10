import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Heart, Package, CreditCard, MapPin, Star, Filter, Search, Truck, ArrowLeft } from 'lucide-react'
import Header from '../components/layout/Header'
import { useTheme } from '@/contexts/ThemeContext'
import { Link } from 'react-router-dom'

// Mock data for buyer dashboard
const mockBuyerData = {
  profile: {
    name: 'John Adebayo',
    email: 'john.adebayo@example.com',
    memberSince: '2024-01-15',
    loyaltyPoints: 1250,
    savedAddresses: [
      { id: 1, name: 'Home', address: '15 Adeniyi Jones Avenue, Ikeja, Lagos', isDefault: true },
      { id: 2, name: 'Office', address: '23 Tafawa Balewa Square, Lagos Island', isDefault: false }
    ]
  },
  orders: [
    {
      id: 'ORD-001',
      date: '2024-01-20',
      status: 'delivered',
      total: 25000,
      items: 3,
      vendor: 'TechHub Store',
      deliveryDate: '2024-01-22'
    },
    {
      id: 'ORD-002',
      date: '2024-01-18',
      status: 'in-transit',
      total: 15000,
      items: 2,
      vendor: 'Fashion Central',
      deliveryDate: '2024-01-21'
    },
    {
      id: 'ORD-003',
      date: '2024-01-15',
      status: 'processing',
      total: 8500,
      items: 1,
      vendor: 'Home Essentials',
      deliveryDate: '2024-01-19'
    }
  ],
  wishlist: [
    {
      id: 1,
      name: 'Wireless Noise-Cancelling Headphones',
      price: 45000,
      originalPrice: 55000,
      image: '/placeholder.svg?text=Headphones&width=100&height=100',
      vendor: 'TechHub Store',
      rating: 4.8,
      inStock: true
    },
    {
      id: 2,
      name: 'Premium Coffee Maker',
      price: 32000,
      originalPrice: 32000,
      image: '/placeholder.svg?text=Coffee&width=100&height=100',
      vendor: 'Kitchen Pro',
      rating: 4.6,
      inStock: false
    }
  ],
  recentlyViewed: [
    {
      id: 1,
      name: 'Smartphone Stand',
      price: 3500,
      image: '/placeholder.svg?text=Stand&width=100&height=100',
      vendor: 'Tech Accessories'
    },
    {
      id: 2,
      name: 'Bluetooth Speaker',
      price: 12000,
      image: '/placeholder.svg?text=Speaker&width=100&height=100',
      vendor: 'Audio World'
    }
  ]
}

export default function BuyerDashboard() {
  const { isDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'account'>('orders')
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500'
      case 'in-transit':
        return 'bg-blue-500'
      case 'processing':
        return 'bg-yellow-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered'
      case 'in-transit':
        return 'In Transit'
      case 'processing':
        return 'Processing'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Main Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
                <p className="text-gray-600">Manage your purchases and preferences</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                {mockBuyerData.profile.loyaltyPoints} Points
              </Badge>
              <Button className="bg-green-600 hover:bg-green-700">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {[
                      { id: 'orders', label: 'My Orders', icon: Package },
                      { id: 'wishlist', label: 'Wishlist', icon: Heart },
                      { id: 'addresses', label: 'Addresses', icon: MapPin },
                      { id: 'account', label: 'Account Settings', icon: CreditCard }
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id as any)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                            activeTab === item.id
                              ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>

              {/* Recently Viewed */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-sm">Recently Viewed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockBuyerData.recentlyViewed.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.vendor}</p>
                        <p className="text-sm font-semibold text-green-600">₦{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">My Orders</h2>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search orders..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {mockBuyerData.orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div>
                                <h3 className="font-semibold">Order #{order.id}</h3>
                                <p className="text-sm text-gray-600">
                                  Placed on {new Date(order.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusText(order.status)}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Vendor</p>
                              <p className="font-medium">{order.vendor}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Amount</p>
                              <p className="font-medium">₦{order.total.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Items</p>
                              <p className="font-medium">{order.items} items</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Expected Delivery</p>
                              <p className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <div className="flex space-x-2">
                              {order.status === 'delivered' && (
                                <Button variant="outline" size="sm">
                                  <Star className="h-4 w-4 mr-2" />
                                  Rate & Review
                                </Button>
                              )}
                              {order.status === 'in-transit' && (
                                <Button variant="outline" size="sm">
                                  <Truck className="h-4 w-4 mr-2" />
                                  Track Order
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                Reorder
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">My Wishlist</h2>
                    <p className="text-gray-600">{mockBuyerData.wishlist.length} items</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {mockBuyerData.wishlist.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="pt-6">
                          <div className="flex space-x-4">
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                            <div className="flex-grow">
                              <h3 className="font-semibold mb-1">{item.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{item.vendor}</p>
                              <div className="flex items-center space-x-2 mb-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm">{item.rating}</span>
                              </div>
                              <div className="flex items-center space-x-2 mb-3">
                                <span className="text-lg font-bold text-green-600">₦{item.price.toLocaleString()}</span>
                                {item.originalPrice > item.price && (
                                  <span className="text-sm line-through text-gray-500">₦{item.originalPrice.toLocaleString()}</span>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" disabled={!item.inStock}>
                                  {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                                </Button>
                                <Button variant="outline" size="sm">
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Delivery Addresses</h2>
                    <Button>
                      <MapPin className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {mockBuyerData.profile.savedAddresses.map((address) => (
                      <Card key={address.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">{address.name}</h3>
                                {address.isDefault && (
                                  <Badge variant="secondary">Default</Badge>
                                )}
                              </div>
                              <p className="text-gray-600">{address.address}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              {!address.isDefault && (
                                <Button variant="outline" size="sm">
                                  Set as Default
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Account Settings</h2>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Full Name</label>
                          <Input value={mockBuyerData.profile.name} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input value={mockBuyerData.profile.email} />
                        </div>
                      </div>
                      <Button>Update Profile</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Loyalty Program</CardTitle>
                      <CardDescription>Track your points and rewards</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-2xl font-bold text-green-600">{mockBuyerData.profile.loyaltyPoints}</p>
                          <p className="text-sm text-gray-600">Available Points</p>
                        </div>
                        <Button variant="outline">
                          View Rewards
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm">
                          You're {2000 - mockBuyerData.profile.loyaltyPoints} points away from Silver tier!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
