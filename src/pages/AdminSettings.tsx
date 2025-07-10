import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Settings, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Mail, 
  Shield, 
  Database,
  Globe,
  Trash2,
  Edit,
  Plus,
  Search
} from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { useAdminSettings } from '../contexts/AdminSettingsContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useTheme } from '@/contexts/ThemeContext'

// Mock data
const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Staff", status: "Active", joinDate: "2024-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Buyer", status: "Active", joinDate: "2024-01-10" },
  { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "Seller", status: "Pending", joinDate: "2024-01-20" },
]

const products = [
  { id: 1, name: "Solar Panel 300W", category: "Renewable Energy", price: 199999, status: "Active", stock: 45 },
  { id: 2, name: "Smart Sofa", category: "Smart Furniture", price: 799999, status: "Active", stock: 12 },
  { id: 3, name: "Laser Level Tool", category: "Construction", price: 299999, status: "Draft", stock: 8 },
]

const systemStats = {
  totalUsers: 1250,
  totalOrders: 3456,
  totalRevenue: 125000000,
  activeProducts: 156,
  pendingApprovals: 23,
  systemUptime: 99.8
}

export default function AdminSettings() {
  const { isDarkMode } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const { settings, updateSettings } = useAdminSettings()

  const handleUserAction = (action: string, userId: number) => {
    toast({
      title: "Action Completed",
      description: `User ${action} successfully.`,
    })
  }

  const handleProductAction = (action: string, productId: number) => {
    toast({
      title: "Action Completed",
      description: `Product ${action} successfully.`,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0 
    }).format(price)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}>
      <Header />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg opacity-90">Manage your Zavolah platform settings and content</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* System Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="text-xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-gray-600">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="text-xl font-bold">{systemStats.totalOrders.toLocaleString()}</div>
                    <p className="text-xs text-gray-600">Total Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                  <div>
                    <div className="text-lg font-bold">{formatPrice(systemStats.totalRevenue)}</div>
                    <p className="text-xs text-gray-600">Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Database className="h-6 w-6 text-purple-600" />
                  <div>
                    <div className="text-xl font-bold">{systemStats.activeProducts}</div>
                    <p className="text-xs text-gray-600">Products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-red-600" />
                  <div>
                    <div className="text-xl font-bold">{systemStats.pendingApprovals}</div>
                    <p className="text-xs text-gray-600">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Globe className="h-6 w-6 text-teal-600" />
                  <div>
                    <div className="text-xl font-bold">{systemStats.systemUptime}%</div>
                    <p className="text-xs text-gray-600">Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="products">Product Management</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>User Management</span>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleUserAction('edited', user.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleUserAction('deleted', user.id)}>
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
          
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Product Management</span>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </CardTitle>
                <CardDescription>Manage products, pricing, and inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleProductAction('edited', product.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleProductAction('deleted', product.id)}>
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
          
          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input id="siteName" defaultValue="Zavolah Energy Hub" />
                    </div>
                    <div>
                      <Label htmlFor="siteEmail">Contact Email</Label>
                      <Input id="siteEmail" defaultValue="contact@zavolah.com" />
                    </div>
                    <div>
                      <Label htmlFor="currency">Default Currency</Label>
                      <Input id="currency" defaultValue="NGN" />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input id="timezone" defaultValue="Africa/Lagos" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Site Description</Label>
                    <Textarea 
                      id="description" 
                      defaultValue="Leading provider of renewable energy solutions, smart furniture, and construction services in Nigeria."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                    </div>
                    <Switch id="twoFactor" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="loginLogging">Login Logging</Label>
                      <p className="text-sm text-gray-600">Log all login attempts</p>
                    </div>
                    <Switch id="loginLogging" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoLogout">Auto Logout</Label>
                      <p className="text-sm text-gray-600">Auto logout after 30 minutes of inactivity</p>
                    </div>
                    <Switch id="autoLogout" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input id="smtpHost" placeholder="smtp.example.com" />
                    </div>
                    <div>
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input id="smtpPort" placeholder="587" />
                    </div>
                    <div>
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input id="smtpUser" placeholder="username@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="smtpPass">SMTP Password</Label>
                      <Input id="smtpPass" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Send system notifications via email</p>
                    </div>
                    <Switch id="emailNotifications" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Homepage Content</CardTitle>
                  <CardDescription>Manage homepage banners and featured content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="heroTitle">Hero Title</Label>
                    <Input id="heroTitle" defaultValue="What makes a home?" />
                  </div>
                  <div>
                    <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                    <Textarea 
                      id="heroSubtitle" 
                      defaultValue="Good design, structure, functional smart furniture, and self-owned 24/7 power supply"
                      rows={3}
                    />
                  </div>
                  <Button>Update Homepage</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Footer Visibility Settings</CardTitle>
                  <CardDescription>Control what appears in the website footer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showZavCharge">Show ZavCharge Product</Label>
                      <p className="text-sm text-gray-600">Display ZavCharge product link in footer</p>
                    </div>
                    <Switch 
                      id="showZavCharge" 
                      checked={settings.showZavCharge}
                      onCheckedChange={(checked) => updateSettings({ showZavCharge: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showReferEarn">Show Refer & Earn</Label>
                      <p className="text-sm text-gray-600">Display Refer & Earn program link in footer</p>
                    </div>
                    <Switch 
                      id="showReferEarn" 
                      checked={settings.showReferEarn}
                      onCheckedChange={(checked) => updateSettings({ showReferEarn: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showMarketplace">Show Marketplace</Label>
                      <p className="text-sm text-gray-600">Display marketplace link in footer</p>
                    </div>
                    <Switch 
                      id="showMarketplace" 
                      checked={settings.showMarketplace}
                      onCheckedChange={(checked) => updateSettings({ showMarketplace: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showStaffAccess">Show Staff Access</Label>
                      <p className="text-sm text-gray-600">Display staff access link in footer</p>
                    </div>
                    <Switch 
                      id="showStaffAccess" 
                      checked={settings.showStaffAccess}
                      onCheckedChange={(checked) => updateSettings({ showStaffAccess: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ZavCharge Product Settings</CardTitle>
                  <CardDescription>Configure ZavCharge product display page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="zavChargeEnabled">Enable ZavCharge Product Page</Label>
                      <p className="text-sm text-gray-600">Make ZavCharge product page accessible</p>
                    </div>
                    <Switch 
                      id="zavChargeEnabled" 
                      checked={settings.zavChargeEnabled}
                      onCheckedChange={(checked) => updateSettings({ zavChargeEnabled: checked })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zavChargeTitle">Product Page Title</Label>
                    <Input 
                      id="zavChargeTitle" 
                      value={settings.zavChargeTitle}
                      onChange={(e) => updateSettings({ zavChargeTitle: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zavChargeDescription">Product Description</Label>
                    <Textarea 
                      id="zavChargeDescription" 
                      value={settings.zavChargeDescription}
                      onChange={(e) => updateSettings({ zavChargeDescription: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Refer & Earn Settings</CardTitle>
                  <CardDescription>Configure referral program settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="referEarnEnabled">Enable Refer & Earn Program</Label>
                      <p className="text-sm text-gray-600">Allow users to join the referral program</p>
                    </div>
                    <Switch 
                      id="referEarnEnabled" 
                      checked={settings.referEarnEnabled}
                      onCheckedChange={(checked) => updateSettings({ referEarnEnabled: checked })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxCommission">Maximum Commission (%)</Label>
                      <Input 
                        id="maxCommission" 
                        type="number" 
                        value={settings.maxCommission}
                        onChange={(e) => updateSettings({ maxCommission: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="minReferrals">Minimum Referrals for Payout</Label>
                      <Input 
                        id="minReferrals" 
                        type="number" 
                        value={settings.minReferrals}
                        onChange={(e) => updateSettings({ minReferrals: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="referralTerms">Referral Terms & Conditions</Label>
                    <Textarea 
                      id="referralTerms" 
                      value={settings.referralTerms}
                      onChange={(e) => updateSettings({ referralTerms: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Featured Products</CardTitle>
                  <CardDescription>Manage products shown on homepage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">Featured</Badge>
                          <Button size="sm" variant="outline">Remove</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Featured Product
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Changes */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-green-600 hover:bg-green-700">Save All Changes</Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
