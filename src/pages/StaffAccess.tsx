import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Trophy, Users, Briefcase, Calendar, Clock, BarChart3, MessageSquare, Settings, Bell } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Link } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'

// Mock data for demonstration
const currentUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@zavolah.com',
  role: 'Staff',
  avatar: '/placeholder.svg?height=50&width=50&text=JD',
  points: 1250,
  tasksCompleted: 24,
  collaborationScore: 92,
  department: 'Renewable Energy'
}

const tasks = [
  { 
    id: 1, 
    title: "Review customer feedback forms", 
    points: 10, 
    status: "completed",
    dueDate: "2024-01-15",
    priority: "medium"
  },
  { 
    id: 2, 
    title: "Update product descriptions for solar panels", 
    points: 15, 
    status: "in-progress",
    dueDate: "2024-01-18",
    priority: "high"
  },
  { 
    id: 3, 
    title: "Prepare monthly sales report", 
    points: 20, 
    status: "pending",
    dueDate: "2024-01-20",
    priority: "high"
  },
  { 
    id: 4, 
    title: "Organize team building event", 
    points: 25, 
    status: "pending",
    dueDate: "2024-01-25",
    priority: "low"
  }
]

const leaderboard = [
  { id: 1, name: "Jane Doe", points: 1350, avatar: "/placeholder.svg?height=50&width=50&text=JD", department: "Smart Furniture" },
  { id: 2, name: "John Smith", points: 1250, avatar: "/placeholder.svg?height=50&width=50&text=JS", department: "Renewable Energy" },
  { id: 3, name: "Alice Johnson", points: 1150, avatar: "/placeholder.svg?height=50&width=50&text=AJ", department: "Construction" },
  { id: 4, name: "Bob Wilson", points: 950, avatar: "/placeholder.svg?height=50&width=50&text=BW", department: "Consultation" },
  { id: 5, name: "Carol Brown", points: 850, avatar: "/placeholder.svg?height=50&width=50&text=CB", department: "Smart Furniture" }
]

const recentActivities = [
  { id: 1, activity: "Completed task: Customer feedback review", time: "2 hours ago", type: "task" },
  { id: 2, activity: "Earned 50 points for weekly goals", time: "1 day ago", type: "points" },
  { id: 3, activity: "Collaborated on solar panel project", time: "2 days ago", type: "collaboration" },
  { id: 4, activity: "Attended training: Smart Home Integration", time: "3 days ago", type: "training" }
]

const activeProjects = [
  { 
    id: 1, 
    name: "Solar Panel Installation Guide", 
    progress: 75, 
    team: ["John", "Jane", "Mike"],
    deadline: "2024-01-30"
  },
  { 
    id: 2, 
    name: "Smart Home Integration Manual", 
    progress: 45, 
    team: ["Alice", "Bob"],
    deadline: "2024-02-15"
  },
  { 
    id: 3, 
    name: "Energy Efficiency Workshop", 
    progress: 20, 
    team: ["Carol", "David", "Emma"],
    deadline: "2024-02-28"
  }
]

export default function StaffAccess() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [formData, setFormData] = useState({
    staffCode: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const { isDarkMode } = useTheme()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login
    setIsLoggedIn(true)
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in to your staff account.",
    })
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    
    try {
      // Import the staff code service
      const { staffCodeService } = await import('@/services/staffCodeService')
      
      const validation = await staffCodeService.validateStaffCode(formData.staffCode)
      
      if (validation.isValid) {
        // Mark code as used
        await staffCodeService.markCodeAsUsed(formData.staffCode, formData.email)
        
        setIsLoggedIn(true)
        setError('')
        toast({
          title: "Account Created Successfully!",
          description: `Welcome to the Zavolah team portal. Department: ${validation.code?.department}`,
        })
      } else {
        setError(validation.message)
      }
    } catch (error) {
      setError('Failed to validate staff code. Please try again.')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsCreatingAccount(false)
    setFormData({
      staffCode: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setError('')
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      default:
        return 'bg-green-500'
    }
  }

  // Login/Register Form
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
        <Header />
        
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
                  Zavolah Staff Portal
                </CardTitle>
                <CardDescription>
                  {isCreatingAccount ? "Create your staff account" : "Login to access staff features"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={isCreatingAccount ? handleCreateAccount : handleLogin}>
                  <div className="space-y-4">
                    {isCreatingAccount && (
                      <div>
                        <label htmlFor="staffCode" className="block text-sm font-medium mb-1">
                          Staff Code *
                        </label>
                        <Input
                          id="staffCode"
                          name="staffCode"
                          type="text"
                          value={formData.staffCode}
                          onChange={handleInputChange}
                          placeholder="Enter your staff code"
                          required
                        />
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium mb-1">
                        Password *
                      </label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    
                    {isCreatingAccount && (
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                          Confirm Password *
                        </label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    )}

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full bg-orange-500 hover:bg-green-600">
                      {isCreatingAccount ? "Create Account" : "Login"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              
              <CardFooter>
                <Button
                  variant="link"
                  className="w-full"
                  onClick={() => {
                    setIsCreatingAccount(!isCreatingAccount)
                    setError('')
                  }}
                >
                  {isCreatingAccount ? "Already have an account? Login" : "New staff? Create an account"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    )
  }

  // Staff Dashboard
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}>
      <Header />

      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-4 border-white">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
                <p className="text-lg opacity-90">{currentUser.department} Department</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                    <Trophy className="h-5 w-5 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">{currentUser.points.toLocaleString()}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">+20% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{currentUser.tasksCompleted}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tasks.filter(t => t.status === 'pending').length} tasks remaining</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Collaboration Score</CardTitle>
                    <Users className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-500">{currentUser.collaborationScore}%</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Top 10% of all staff</p>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Monthly Progress</CardTitle>
                  <CardDescription>You're 66% of the way to your next milestone!</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={66} className="w-full h-3" />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>1,250 points</span>
                    <span>Goal: 1,900 points</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities and Active Projects */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'task' ? 'bg-green-500' :
                            activity.type === 'points' ? 'bg-orange-500' :
                            activity.type === 'collaboration' ? 'bg-blue-500' : 'bg-purple-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.activity}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeProjects.map((project) => (
                        <div key={project.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{project.name}</h4>
                            <Badge variant="outline">{project.progress}%</Badge>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Team: {project.team.join(', ')}</span>
                            <span>Due: {project.deadline}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
                <CardDescription>Manage and track your assigned tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{task.title}</h3>
                            <span className={`inline-block w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>Points: {task.points}</span>
                            <span>Due: {task.dueDate}</span>
                            <Badge variant="outline" className="capitalize">{task.priority}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          task.status === 'completed' ? 'default' : 
                          task.status === 'in-progress' ? 'secondary' : 'outline'
                        } className="capitalize">
                          {task.status.replace('-', ' ')}
                        </Badge>
                        {task.status !== 'completed' && (
                          <Button size="sm" variant="outline">
                            Update Status
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View All Tasks</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Staff Leaderboard</CardTitle>
                <CardDescription>See how you rank among your colleagues this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((staff, index) => (
                    <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`font-bold text-lg w-8 text-center ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-400' :
                          index === 2 ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={staff.avatar} alt={staff.name} />
                          <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{staff.name}</p>
                          <p className="text-sm text-gray-500">{staff.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-500">{staff.points.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="collaboration">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="mr-2 h-5 w-5" />
                      Active Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {activeProjects.map((project) => (
                        <li key={project.id} className="flex items-center justify-between">
                          <span className="font-medium">{project.name}</span>
                          <Progress value={project.progress} className="w-24 h-2" />
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      Upcoming Meetings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">Team Sync</p>
                          <p className="text-sm text-gray-500">Today, 10:00 AM</p>
                        </div>
                      </li>
                      <li className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">Project Review</p>
                          <p className="text-sm text-gray-500">Tomorrow, 2:00 PM</p>
                        </div>
                      </li>
                      <li className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">Training Session</p>
                          <p className="text-sm text-gray-500">Friday, 11:00 AM</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Collaboration Tools</CardTitle>
                  <CardDescription>Quick access to team collaboration platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <MessageSquare className="h-6 w-6" />
                      <span className="text-sm">Slack</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <BarChart3 className="h-6 w-6" />
                      <span className="text-sm">Analytics</span>
                    </Button>
                    <Link to="/staff/crm">
                      <Button variant="outline" className="h-20 w-full flex flex-col items-center justify-center space-y-2">
                        <Users className="h-6 w-6" />
                        <span className="text-sm">CRM</span>
                      </Button>
                    </Link>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Calendar className="h-6 w-6" />
                      <span className="text-sm">Calendar</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
