import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, ShoppingCart, MessageSquare, Settings, DollarSign, TrendingUp, Package, Zap, Upload, Download, Plus, Edit, Trash2, Eye, UserPlus, Image } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import Header from '../components/layout/Header'
import { useTheme } from '@/contexts/ThemeContext'
import { useAdminSettings } from '@/contexts/AdminSettingsContext'

export default function AdminDashboard() {
  const { isDarkMode } = useTheme()
  const { settings, updateSettings } = useAdminSettings()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    zavchargeUsers: 0,
    marketplaceOrders: 0,
    storeOrders: 0,
    newsletterSubscribers: 0
  })

  // Modal states
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  
  // Form states
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    department: '',
    role: 'staff',
    staffCode: ''
  })
  
  const [imageForm, setImageForm] = useState({
    title: '',
    category: 'product',
    description: '',
    file: null as File | null
  })

  // Data states
  const [users, setUsers] = useState<any[]>([])
  const [staffCodes, setStaffCodes] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [marketplaceData, setMarketplaceData] = useState<any[]>([])
  const [zavchargeData, setZavchargeData] = useState<any[]>([])
  const [subscribers, setSubscribers] = useState<any[]>([])

  // Check admin access
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      window.location.href = '/'
      return
    }

    const user = JSON.parse(currentUser)
    if (user.email !== 'zavolah@gmail.com') {
      window.location.href = '/'
      return
    }

    loadAllData()
  }, [])

  const loadAllData = () => {
    // Load users
    const usersData = JSON.parse(localStorage.getItem('zavolah-users') || '[]')
    setUsers(usersData)

    // Load staff codes
    const staffCodesData = JSON.parse(localStorage.getItem('staff-codes') || '[]')
    setStaffCodes(staffCodesData)

    // Load images
    const imagesData = JSON.parse(localStorage.getItem('uploaded-images') || '[]')
    setImages(imagesData)

    // Load orders
    const storeOrders = JSON.parse(localStorage.getItem('zavolah-orders') || '[]')
    const marketplaceOrders = JSON.parse(localStorage.getItem('marketplaceOrders') || '[]')
    const academyOrders = JSON.parse(localStorage.getItem('academy-orders') || '[]')
    const allOrders = [...storeOrders, ...marketplaceOrders, ...academyOrders]
    setOrders(allOrders)

    // Load marketplace data
    setMarketplaceData(marketplaceOrders)

    // Load ZavCharge data
    const zavchargeRegistrations = JSON.parse(localStorage.getItem('zavcharge-registrations') || '[]')
    setZavchargeData(zavchargeRegistrations)

    // Load subscribers
    const newsletterSubscribers = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]')
    setSubscribers(newsletterSubscribers)

    // Calculate stats
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || order.paymentAmount || 0), 0)
    setStats({
      totalUsers: usersData.length,
      totalOrders: allOrders.length,
      totalRevenue,
      zavchargeUsers: zavchargeRegistrations.length,
      marketplaceOrders: marketplaceOrders.length,
      storeOrders: storeOrders.length,
      newsletterSubscribers: newsletterSubscribers.length
    })
  }

  // Generate staff code
  const generateStaffCode = () => {
    const departments = ['ENG', 'SAL', 'SUP', 'ADM', 'FIN']
    const randomDept = departments[Math.floor(Math.random() * departments.length)]
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
    return `${randomDept}${randomNum}`
  }

  // Create staff code
  const handleCreateStaff = () => {
    if (!staffForm.name || !staffForm.email || !staffForm.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    const newStaffCode = generateStaffCode()
    const staffData = {
      id: Date.now().toString(),
      ...staffForm,
      staffCode: newStaffCode,
      createdAt: new Date().toISOString(),
      isActive: true
    }

    const updatedStaffCodes = [...staffCodes, staffData]
    setStaffCodes(updatedStaffCodes)
    localStorage.setItem('staff-codes', JSON.stringify(updatedStaffCodes))

    toast({
      title: "Staff Code Generated",
      description: `Staff code ${newStaffCode} created successfully.`,
    })

    setStaffForm({
      name: '',
      email: '',
      department: '',
      role: 'staff',
      staffCode: ''
    })
    setIsStaffModalOpen(false)
    loadAllData()
  }

  // Upload image
  const handleImageUpload = () => {
    if (!imageForm.title || !imageForm.file) {
      toast({
        title: "Missing Information",
        description: "Please provide title and select a file.",
        variant: "destructive"
      })
      return
    }

    // In a real app, this would upload to a cloud service
    const imageData = {
      id: Date.now().toString(),
      title: imageForm.title,
      category: imageForm.category,
      description: imageForm.description,
      fileName: imageForm.file.name,
      fileSize: imageForm.file.size,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(imageForm.file) // This is for demo purposes
    }

    const updatedImages = [...images, imageData]
    setImages(updatedImages)
    localStorage.setItem('uploaded-images', JSON.stringify(updatedImages))

    toast({
      title: "Image Uploaded",
      description: "Image uploaded successfully.",
    })

    setImageForm({
      title: '',
      category: 'product',
      description: '',
      file: null
    })
    setIsImageModalOpen(false)
    loadAllData()
  }

  // Delete user
  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem('zavolah-users', JSON.stringify(updatedUsers))
    
    toast({
      title: "User Deleted",
      description: "User has been removed from the system.",
    })
    
    loadAllData()
  }

  // Export data
  const handleExportData = (dataType: string) => {
    let data: any[] = []
    let filename = ''

    switch (dataType) {
      case 'users':
        data = users
        filename = 'users.json'
        break
      case 'orders':
        data = orders
        filename = 'orders.json'
        break
      case 'zavcharge':
        data = zavchargeData
        filename = 'zavcharge-data.json'
        break
      case 'subscribers':
        data = subscribers
        filename = 'newsletter-subscribers.json'
        break
      default:
        return
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: `${filename} has been downloaded.`,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0 
    }).format(price / 100)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}>
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your Zavolah platform and monitor key metrics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +10% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                +25% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newsletterSubscribers}</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="zavcharge">ZavCharge</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Store Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.storeOrders}</div>
                  <p className="text-xs text-muted-foreground">Physical products sold</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Marketplace Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.marketplaceOrders}</div>
                  <p className="text-xs text-muted-foreground">Design purchases</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5" />
                    ZavCharge Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.zavchargeUsers}</div>
                  <p className="text-xs text-muted-foreground">Charging network members</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest orders from store and marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Order management system will be implemented here.
                  </p>
                  <Button>View All Orders</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  User Management
                  <Button onClick={() => handleExportData('users')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Users
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage registered users and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Staff Management
                  <Button onClick={() => setIsStaffModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Staff Code
                  </Button>
                </CardTitle>
                <CardDescription>
                  Generate and manage staff access codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffCodes.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-mono font-bold">{staff.staffCode}</TableCell>
                        <TableCell>{staff.name}</TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>
                          <Badge variant={staff.isActive ? 'default' : 'secondary'}>
                            {staff.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(staff.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Image Management
                  <Button onClick={() => setIsImageModalOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </CardTitle>
                <CardDescription>
                  Upload and manage images for products and content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <Card key={image.id}>
                      <CardContent className="pt-4">
                        <img 
                          src={image.url} 
                          alt={image.title}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <h4 className="font-semibold text-sm">{image.title}</h4>
                        <p className="text-xs text-gray-600">{image.category}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(image.uploadedAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zavcharge" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ZavCharge Network</CardTitle>
                <CardDescription>
                  Monitor charging stations and user activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    ZavCharge management interface will be implemented here.
                  </p>
                  <Button>Manage Stations</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure platform-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Footer Visibility Controls */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Footer Visibility</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showZavCharge">Show ZavCharge</Label>
                      <Switch
                        id="showZavCharge"
                        checked={settings.showZavCharge}
                        onCheckedChange={(checked) => updateSettings({ showZavCharge: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showReferEarn">Show Refer & Earn</Label>
                      <Switch
                        id="showReferEarn"
                        checked={settings.showReferEarn}
                        onCheckedChange={(checked) => updateSettings({ showReferEarn: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showMarketplace">Show Marketplace</Label>
                      <Switch
                        id="showMarketplace"
                        checked={settings.showMarketplace}
                        onCheckedChange={(checked) => updateSettings({ showMarketplace: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showStaffAccess">Show Staff Access</Label>
                      <Switch
                        id="showStaffAccess"
                        checked={settings.showStaffAccess}
                        onCheckedChange={(checked) => updateSettings({ showStaffAccess: checked })}
                      />
                    </div>
                  </div>
                </div>

                {/* ZavCharge Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">ZavCharge Product Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="zavChargeEnabled">ZavCharge Enabled</Label>
                      <Switch
                        id="zavChargeEnabled"
                        checked={settings.zavChargeEnabled}
                        onCheckedChange={(checked) => updateSettings({ zavChargeEnabled: checked })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zavChargeTitle">ZavCharge Title</Label>
                      <Input
                        id="zavChargeTitle"
                        value={settings.zavChargeTitle}
                        onChange={(e) => updateSettings({ zavChargeTitle: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zavChargeDescription">ZavCharge Description</Label>
                      <Textarea
                        id="zavChargeDescription"
                        value={settings.zavChargeDescription}
                        onChange={(e) => updateSettings({ zavChargeDescription: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Data Export */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Data Management</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => handleExportData('users')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Users
                    </Button>
                    <Button variant="outline" onClick={() => handleExportData('orders')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Orders
                    </Button>
                    <Button variant="outline" onClick={() => handleExportData('zavcharge')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export ZavCharge
                    </Button>
                    <Button variant="outline" onClick={() => handleExportData('subscribers')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Subscribers
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Staff Code Generation Modal */}
        <Dialog open={isStaffModalOpen} onOpenChange={setIsStaffModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Staff Code</DialogTitle>
              <DialogDescription>Create a new staff access code</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="staffName">Staff Name</Label>
                <Input
                  id="staffName"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter staff name"
                />
              </div>
              <div>
                <Label htmlFor="staffEmail">Email</Label>
                <Input
                  id="staffEmail"
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="staffDepartment">Department</Label>
                <Select value={staffForm.department} onValueChange={(value) => setStaffForm(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="staffRole">Role</Label>
                <Select value={staffForm.role} onValueChange={(value) => setStaffForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStaffModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateStaff}>
                <UserPlus className="mr-2 h-4 w-4" />
                Generate Code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image Upload Modal */}
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
              <DialogDescription>Upload a new image to the gallery</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageTitle">Image Title</Label>
                <Input
                  id="imageTitle"
                  value={imageForm.title}
                  onChange={(e) => setImageForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter image title"
                />
              </div>
              <div>
                <Label htmlFor="imageCategory">Category</Label>
                <Select value={imageForm.category} onValueChange={(value) => setImageForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="hero">Hero Image</SelectItem>
                    <SelectItem value="gallery">Gallery</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imageDescription">Description</Label>
                <Textarea
                  id="imageDescription"
                  value={imageForm.description}
                  onChange={(e) => setImageForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter image description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="imageFile">Image File</Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImageModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleImageUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </Tabs>
      </main>
    </div>
  )
}
