import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Store, Package, TrendingUp, DollarSign, Users, Plus, Edit, Trash2, Eye, ArrowLeft, Upload, BarChart3, ShoppingCart } from 'lucide-react'
import Header from '../components/layout/Header'
import { useTheme } from '@/contexts/ThemeContext'
import { Link } from 'react-router-dom'

// Mock seller data
const mockSellerData = {
  profile: {
    storeName: 'TechHub Store',
    sellerName: 'John Adebayo',
    email: 'john@techhub.com',
    joinedDate: '2024-01-10',
    storeRating: 4.8,
    totalReviews: 156,
    verificationStatus: 'verified'
  },
  stats: {
    totalProducts: 24,
    totalSales: 180,
    revenue: 2850000,
    pendingOrders: 5,
    thisMonthSales: 45,
    thisMonthRevenue: 675000
  },
  products: [
    {
      id: 'PRD-001',
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      price: 25000,
      stock: 15,
      sold: 8,
      status: 'active',
      image: '/placeholder.svg?text=Headphones&width=100&height=100',
      dateAdded: '2024-01-15'
    },
    {
      id: 'PRD-002',
      name: 'Smartphone Case',
      category: 'Accessories',
      price: 3500,
      stock: 0,
      sold: 12,
      status: 'out-of-stock',
      image: '/placeholder.svg?text=Case&width=100&height=100',
      dateAdded: '2024-01-12'
    },
    {
      id: 'PRD-003',
      name: 'USB-C Cable',
      category: 'Accessories',
      price: 1500,
      stock: 25,
      sold: 20,
      status: 'active',
      image: '/placeholder.svg?text=Cable&width=100&height=100',
      dateAdded: '2024-01-08'
    }
  ],
  orders: [
    {
      id: 'ORD-101',
      customer: 'Ahmed Hassan',
      product: 'Wireless Bluetooth Headphones',
      quantity: 1,
      total: 25000,
      status: 'pending',
      date: '2024-01-20'
    },
    {
      id: 'ORD-102',
      customer: 'Sarah Johnson',
      product: 'USB-C Cable',
      quantity: 2,
      total: 3000,
      status: 'shipped',
      date: '2024-01-19'
    }
  ]
}

export default function SellerDashboard() {
  const { isDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analytics'>('overview')
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    images: [] as string[]
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'out-of-stock':
        return 'bg-red-500'
      case 'inactive':
        return 'bg-gray-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'shipped':
        return 'bg-blue-500'
      case 'delivered':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleAddProduct = () => {
    console.log('Adding product:', newProduct)
    setIsAddProductOpen(false)
    setNewProduct({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      images: []
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // In real app, upload to Cloudinary and get URLs
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
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
                <h1 className="text-3xl font-bold">Seller Dashboard</h1>
                <p className="text-gray-600">{mockSellerData.profile.storeName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                {mockSellerData.profile.storeRating} ★ ({mockSellerData.profile.totalReviews} reviews)
              </Badge>
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Add a new product to your store inventory
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-name">Product Name</Label>
                        <Input
                          id="product-name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="e.g., Electronics, Fashion"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₦)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your product..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="images">Product Images</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          id="images"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="images"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click to upload images</p>
                        </label>
                        {newProduct.images.length > 0 && (
                          <div className="flex space-x-2 mt-2">
                            {newProduct.images.map((img, index) => (
                              <img key={index} src={img} alt={`Product ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddProduct}>
                        Add Product
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Package className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold">{mockSellerData.stats.totalProducts}</div>
                        <p className="text-sm text-gray-600">Total Products</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold">{mockSellerData.stats.totalSales}</div>
                        <p className="text-sm text-gray-600">Total Sales</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-8 w-8 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold">₦{(mockSellerData.stats.revenue / 1000000).toFixed(1)}M</div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Users className="h-8 w-8 text-orange-600" />
                      <div>
                        <div className="text-2xl font-bold">{mockSellerData.stats.pendingOrders}</div>
                        <p className="text-sm text-gray-600">Pending Orders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders & Top Products */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockSellerData.orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <p className="text-sm text-gray-600">{order.product}</p>
                            <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₦{order.total.toLocaleString()}</p>
                            <Badge className={getStatusColor(order.status)} size="sm">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Best selling products this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockSellerData.products.slice(0, 3).map((product) => (
                        <div key={product.id} className="flex items-center space-x-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-grow">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.sold} sold</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₦{product.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Product Inventory</h2>
                <div className="flex items-center space-x-3">
                  <Input placeholder="Search products..." className="w-64" />
                  <Button variant="outline">
                    Filter
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {mockSellerData.products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            <Badge className={getStatusColor(product.status)}>
                              {product.status === 'out-of-stock' ? 'Out of Stock' : 'Active'}
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Category</p>
                              <p className="font-medium">{product.category}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Price</p>
                              <p className="font-medium">₦{product.price.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Stock</p>
                              <p className="font-medium">{product.stock} units</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Sold</p>
                              <p className="font-medium">{product.sold} units</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Order Management</h2>
                <Button variant="outline">
                  Export Orders
                </Button>
              </div>

              <div className="space-y-4">
                {mockSellerData.orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Customer</p>
                          <p className="font-medium">{order.customer}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Product</p>
                          <p className="font-medium">{order.product}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="font-medium">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="font-medium">₦{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {order.status === 'pending' && (
                          <>
                            <Button size="sm">
                              Mark as Shipped
                            </Button>
                            <Button variant="destructive" size="sm">
                              Cancel Order
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Sales Analytics</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>This Month Performance</CardTitle>
                  <CardDescription>Sales and revenue for the current month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Sales This Month</p>
                      <p className="text-3xl font-bold text-green-600">{mockSellerData.stats.thisMonthSales}</p>
                      <p className="text-sm text-green-600">+25% from last month</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Revenue This Month</p>
                      <p className="text-3xl font-bold text-blue-600">₦{(mockSellerData.stats.thisMonthRevenue / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-blue-600">+18% from last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics Coming Soon</h3>
                <p className="text-gray-600">Detailed charts and insights will be available here</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
