import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Plus, Key, Users, Clock, Shield, Eye, EyeOff, Copy, RotateCcw, Trash2, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'
import Header from '../components/layout/Header'
import { useTheme } from '@/contexts/ThemeContext'
import { staffCodeService, type StaffCode, type CreateStaffCodeRequest } from '@/services/staffCodeService'

export default function AdminStaffCodes() {
  const { isDarkMode } = useTheme()
  const [staffCodes, setStaffCodes] = useState<StaffCode[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'exhausted' | 'inactive'>('all')

  const [newCodeData, setNewCodeData] = useState<CreateStaffCodeRequest>({
    department: '',
    position: '',
    expirationDays: 30,
    maxUses: 1
  })

  const departments = [
    'Administration',
    'Operations',
    'Sales & Marketing',
    'Customer Service',
    'Technical Support',
    'Human Resources',
    'Finance',
    'Product Development'
  ]

  const positions = [
    'Manager',
    'Senior Staff',
    'Staff',
    'Junior Staff',
    'Intern',
    'Contractor',
    'Consultant'
  ]

  useEffect(() => {
    loadStaffCodes()
  }, [])

  const loadStaffCodes = async () => {
    try {
      setIsLoading(true)
      const codes = await staffCodeService.getAllStaffCodes()
      setStaffCodes(codes)
    } catch (error) {
      console.error('Failed to load staff codes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCode = async () => {
    try {
      const newCode = await staffCodeService.createStaffCode(newCodeData)
      setStaffCodes(prev => [newCode, ...prev])
      setIsCreateModalOpen(false)
      setNewCodeData({
        department: '',
        position: '',
        expirationDays: 30,
        maxUses: 1
      })
    } catch (error) {
      console.error('Failed to create staff code:', error)
    }
  }

  const handleDeactivateCode = async (codeId: string) => {
    try {
      await staffCodeService.deactivateStaffCode(codeId)
      setStaffCodes(prev => prev.map(code => 
        code.id === codeId ? { ...code, isActive: false } : code
      ))
    } catch (error) {
      console.error('Failed to deactivate code:', error)
    }
  }

  const handleExtendCode = async (codeId: string, days: number) => {
    try {
      await staffCodeService.extendStaffCode(codeId, days)
      loadStaffCodes() // Reload to get updated data
    } catch (error) {
      console.error('Failed to extend code:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // In real app, show toast notification
  }

  const getStatusBadge = (code: StaffCode) => {
    const status = staffCodeService.getCodeStatus(code)
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      case 'expired':
        return <Badge variant="destructive"><Clock className="h-3 w-3 mr-1" />Expired</Badge>
      case 'exhausted':
        return <Badge variant="secondary"><Users className="h-3 w-3 mr-1" />Exhausted</Badge>
      case 'inactive':
        return <Badge variant="outline"><EyeOff className="h-3 w-3 mr-1" />Inactive</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredCodes = staffCodes.filter(code => {
    const matchesSearch = code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         code.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         code.position.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (statusFilter === 'all') return matchesSearch
    
    const status = staffCodeService.getCodeStatus(code)
    return matchesSearch && status === statusFilter
  })

  const stats = {
    total: staffCodes.length,
    active: staffCodes.filter(code => staffCodeService.getCodeStatus(code) === 'active').length,
    expired: staffCodes.filter(code => staffCodeService.getCodeStatus(code) === 'expired').length,
    used: staffCodes.filter(code => code.usageCount > 0).length
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Staff Code Management</h1>
              <p className="text-gray-600">Generate and manage staff registration codes</p>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Staff Code</DialogTitle>
                  <DialogDescription>
                    Create a new staff registration code with specific parameters
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      value={newCodeData.department} 
                      onValueChange={(value) => setNewCodeData(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Select 
                      value={newCodeData.position} 
                      onValueChange={(value) => setNewCodeData(prev => ({ ...prev, position: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map(pos => (
                          <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expirationDays">Expiration (Days)</Label>
                      <Input
                        id="expirationDays"
                        type="number"
                        min="1"
                        max="365"
                        value={newCodeData.expirationDays}
                        onChange={(e) => setNewCodeData(prev => ({ 
                          ...prev, 
                          expirationDays: parseInt(e.target.value) || 30 
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxUses">Max Uses</Label>
                      <Input
                        id="maxUses"
                        type="number"
                        min="1"
                        max="10"
                        value={newCodeData.maxUses}
                        onChange={(e) => setNewCodeData(prev => ({ 
                          ...prev, 
                          maxUses: parseInt(e.target.value) || 1 
                        }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateCode}
                      disabled={!newCodeData.department || !newCodeData.position}
                    >
                      Generate Code
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Key className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-sm text-gray-600">Total Codes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{stats.active}</div>
                    <p className="text-sm text-gray-600">Active Codes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold">{stats.expired}</div>
                    <p className="text-sm text-gray-600">Expired Codes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{stats.used}</div>
                    <p className="text-sm text-gray-600">Used Codes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <Input
                    placeholder="Search codes, departments, or positions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="exhausted">Exhausted</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Staff Codes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Codes</CardTitle>
              <CardDescription>
                Manage all generated staff registration codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCodes.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {code.code}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(code.code)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{code.department}</TableCell>
                        <TableCell>{code.position}</TableCell>
                        <TableCell>{getStatusBadge(code)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {code.usageCount}/{code.maxUses} uses
                            {code.usedBy && (
                              <div className="text-xs text-gray-500">
                                Last: {new Date(code.usedAt!).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(code.expiresAt).toLocaleDateString()}
                            {staffCodeService.isCodeExpired(code) && (
                              <div className="text-xs text-red-500">Expired</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {code.isActive && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleExtendCode(code.id, 30)}
                                  title="Extend by 30 days"
                                >
                                  <Calendar className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeactivateCode(code.id)}
                                  title="Deactivate code"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {filteredCodes.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <Key className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No staff codes found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Generate your first staff code to get started.'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Staff Code Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Code Generation</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Codes follow the pattern: da70t93@6£LZ0h</li>
                    <li>• Each code is unique and cryptographically secure</li>
                    <li>• Codes can be department and position specific</li>
                    <li>• Expiration dates are enforced automatically</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Management</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Codes can be limited to specific number of uses</li>
                    <li>• Usage is tracked and logged with timestamps</li>
                    <li>• Expired or exhausted codes are automatically blocked</li>
                    <li>• Codes can be deactivated instantly if needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
