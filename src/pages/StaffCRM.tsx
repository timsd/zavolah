import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Users, Briefcase, MessageSquare, Bell, Settings, LogOut, Trash2, DollarSign, UserPlus, BarChart3 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useTheme } from '@/contexts/ThemeContext'

// Mock data
const currentUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@zavolah.com',
  role: 'Staff Manager',
  avatar: '/placeholder.svg?height=50&width=50&text=JD',
  points: 1250,
  tasksCompleted: 24,
  collaborationScore: 92,
}

const tasks = [
  { id: 1, title: "Review customer feedback", points: 10, status: "completed", assignedTo: '1' },
  { id: 2, title: "Update product descriptions", points: 15, status: "in-progress", assignedTo: '1' },
  { id: 3, title: "Prepare monthly report", points: 20, status: "pending", assignedTo: '2' },
]

const chatMessages = [
  { id: 1, sender: 'Jane Smith', message: 'Hey, can you help me with the new solar panel specs?', timestamp: '10:30 AM' },
  { id: 2, sender: 'John Doe', message: 'Sure, I will send them over in a few minutes.', timestamp: '10:32 AM' },
  { id: 3, sender: 'Jane Smith', message: 'Great, thanks!', timestamp: '10:33 AM' },
]

const staffMembers = [
  { id: '1', name: 'John Doe', email: 'john.doe@zavolah.com', role: 'Staff Manager', avatar: '/placeholder.svg?height=50&width=50&text=JD', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@zavolah.com', role: 'Staff', avatar: '/placeholder.svg?height=50&width=50&text=JS', status: 'active' },
  { id: '3', name: 'Admin User', email: 'admin@zavolah.com', role: 'Admin', avatar: '/placeholder.svg?height=50&width=50&text=AU', status: 'active' },
]

export default function StaffCRM() {
  const { isDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [newTask, setNewTask] = useState({ title: '', description: '', points: 0, assignedTo: '' })
  const [chatMessage, setChatMessage] = useState('')
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const [tagPosition, setTagPosition] = useState(0)
  const [currentTagSearch, setCurrentTagSearch] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isPrivateChat, setIsPrivateChat] = useState(false)
  const [selectedPrivateUser, setSelectedPrivateUser] = useState<string>('')
  const { toast } = useToast()

  const handleNewTask = () => {
    toast({
      title: "Task Created",
      description: `New task "${newTask.title}" has been created successfully.`,
    })
    setNewTask({ title: '', description: '', points: 0, assignedTo: '' })
  }

  const handleSendMessage = () => {
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the team.",
    })
    setChatMessage('')
    setShowTagSuggestions(false)
  }

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    setChatMessage(value);
    
    // Check for @ symbol for tagging
    const atIndex = value.lastIndexOf('@', cursorPosition - 1);
    if (atIndex !== -1) {
      const textAfterAt = value.substring(atIndex + 1, cursorPosition);
      if (textAfterAt.length === 0 || /^[a-zA-Z\s]*$/.test(textAfterAt)) {
        setShowTagSuggestions(true);
        setTagPosition(atIndex);
        setCurrentTagSearch(textAfterAt.toLowerCase());
      } else {
        setShowTagSuggestions(false);
      }
    } else {
      setShowTagSuggestions(false);
    }
  };

  const handleTagSelect = (staff: typeof staffMembers[0]) => {
    const beforeTag = chatMessage.substring(0, tagPosition);
    const afterTag = chatMessage.substring(tagPosition + currentTagSearch.length + 1);
    setChatMessage(`${beforeTag}@${staff.name} ${afterTag}`);
    setShowTagSuggestions(false);
  };

  const filteredStaffForTag = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(currentTagSearch) && staff.id !== currentUser.id
  );

  const handleConvertPoints = () => {
    toast({
      title: "Points Conversion",
      description: "Your points have been converted to cash and will be processed within 24 hours.",
    })
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteAccount = () => {
    toast({
      title: "Account Deletion Request",
      description: "Your account deletion request has been submitted to admin for approval.",
    })
    setShowDeleteConfirmation(false)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}>
      <Header />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Staff CRM Portal</h1>
              <p className="text-lg opacity-90">Manage staff, tasks, and team collaboration</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="chat">Team Chat</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                    <DollarSign className="h-5 w-5 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">{currentUser.points}</div>
                    <Button size="sm" onClick={handleConvertPoints} className="mt-2">
                      Convert to Cash
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{currentUser.tasksCompleted}</div>
                    <p className="text-sm text-gray-600">6 tasks remaining</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-500">{currentUser.collaborationScore}%</div>
                    <p className="text-sm text-gray-600">Team efficiency</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Task completed: Customer feedback review</span>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <UserPlus className="h-5 w-5 text-blue-500" />
                      <span>New team member onboarded</span>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-5 w-5 text-purple-500" />
                      <span>Project milestone reached</span>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>Create and manage team tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="Task Title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Task Description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="Points"
                        value={newTask.points}
                        onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) })}
                      />
                      <Select 
                        value={newTask.assignedTo} 
                        onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          {staffMembers.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={staff.avatar} alt={staff.name} />
                                  <AvatarFallback className="text-xs">{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span>{staff.name}</span>
                                <span className="text-xs text-gray-500">({staff.role})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleNewTask}>Create Task</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Current Tasks</h3>
                  <div className="space-y-4">
                    {tasks.map((task) => {
                      const assignedStaff = staffMembers.find(staff => staff.id === task.assignedTo);
                      return (
                        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            {task.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                            {task.status === 'in-progress' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                            {task.status === 'pending' && <AlertCircle className="h-5 w-5 text-red-500" />}
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm text-gray-500">Points: {task.points}</p>
                              {assignedStaff && (
                                <p className="text-sm text-blue-600">Assigned to: {assignedStaff.name}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={task.status === 'completed' ? 'default' : 'outline'}>
                              {task.status}
                            </Badge>
                            {assignedStaff && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={assignedStaff.avatar} alt={assignedStaff.name} />
                                <AvatarFallback className="text-xs">{assignedStaff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Team Chat</CardTitle>
                <CardDescription>Communicate with your team members</CardDescription>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="private-chat"
                      checked={isPrivateChat}
                      onCheckedChange={setIsPrivateChat}
                    />
                    <Label htmlFor="private-chat">Private Chat</Label>
                  </div>
                  {isPrivateChat && (
                    <Select value={selectedPrivateUser} onValueChange={setSelectedPrivateUser}>
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Select user for private chat..." />
                      </SelectTrigger>
                      <SelectContent>
                        {staffMembers.filter(staff => staff.id !== currentUser.id).map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={staff.avatar} alt={staff.name} />
                                <AvatarFallback className="text-xs">{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span>{staff.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4 mb-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="mb-4">
                      <div className="font-semibold">{message.sender}</div>
                      <div className="text-sm">{message.message}</div>
                      <div className="text-xs text-gray-500">{message.timestamp}</div>
                    </div>
                  ))}
                </ScrollArea>
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Type your message... (use @ to tag team members)"
                      value={chatMessage}
                      onChange={handleChatInputChange}
                      className="flex-grow"
                    />
                    <Button onClick={handleSendMessage}>
                      <MessageSquare className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                  
                  {showTagSuggestions && filteredStaffForTag.length > 0 && (
                    <div className="absolute bottom-full left-0 w-full bg-white border rounded-lg shadow-lg z-10 mb-1">
                      {filteredStaffForTag.map((staff) => (
                        <div
                          key={staff.id}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleTagSelect(staff)}
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={staff.avatar} alt={staff.name} />
                            <AvatarFallback className="text-xs">{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{staff.name}</span>
                          <span className="text-xs text-gray-500">({staff.role})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your account and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{currentUser.name}</h3>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                    <p className="text-sm text-gray-500">Role: {currentUser.role}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <Switch id="notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600">Danger Zone</h3>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Manage staff accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Staff Members</h3>
                  <div className="space-y-4">
                    {staffMembers.map((staff) => (
                      <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={staff.avatar} alt={staff.name} />
                            <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{staff.name}</p>
                            <p className="text-sm text-gray-500">{staff.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
                            {staff.role}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Add New Staff</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Name" />
                    <Input placeholder="Email" type="email" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Staff">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Staff</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Admin">
                          <div className="flex items-center space-x-2">
                            <Settings className="h-4 w-4" />
                            <span>Admin</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Manager">
                          <div className="flex items-center space-x-2">
                            <Briefcase className="h-4 w-4" />
                            <span>Manager</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="mt-4">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Staff Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All of your data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAccount}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
