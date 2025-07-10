import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { BookOpen, PlayCircle, Award, Clock, Users, Star, Download, ArrowLeft, Trophy, Target, Calendar } from 'lucide-react'
import Header from '../components/layout/Header'
import { useTheme } from '@/contexts/ThemeContext'
import { Link } from 'react-router-dom'

// Mock student data
const mockStudentData = {
  profile: {
    name: 'John Adebayo',
    email: 'john.adebayo@student.zavolah.com',
    studentId: 'STU-2024-001',
    enrollmentDate: '2024-01-10',
    currentLevel: 'Intermediate',
    totalPoints: 1850,
    certificatesEarned: 3
  },
  stats: {
    coursesEnrolled: 8,
    coursesCompleted: 5,
    totalHours: 45,
    currentStreak: 7,
    averageScore: 87
  },
  enrolledCourses: [
    {
      id: 'CRS-001',
      title: 'Digital Marketing Fundamentals',
      instructor: 'Sarah Johnson',
      category: 'Marketing',
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
      duration: '6 hours',
      rating: 4.8,
      certificate: false,
      lastAccessed: '2024-01-20',
      nextLesson: 'Social Media Strategy'
    },
    {
      id: 'CRS-002',
      title: 'Web Development Basics',
      instructor: 'Michael Chen',
      category: 'Technology',
      progress: 100,
      totalLessons: 25,
      completedLessons: 25,
      duration: '12 hours',
      rating: 4.9,
      certificate: true,
      lastAccessed: '2024-01-18',
      nextLesson: null
    },
    {
      id: 'CRS-003',
      title: 'Business Communication',
      instructor: 'Dr. Amina Hassan',
      category: 'Business',
      progress: 40,
      totalLessons: 15,
      completedLessons: 6,
      duration: '4 hours',
      rating: 4.7,
      certificate: false,
      lastAccessed: '2024-01-19',
      nextLesson: 'Effective Presentation Skills'
    }
  ],
  achievements: [
    {
      id: 1,
      title: 'First Course Completed',
      description: 'Complete your first course',
      icon: Trophy,
      earned: true,
      earnedDate: '2024-01-12'
    },
    {
      id: 2,
      title: 'Speed Learner',
      description: 'Complete 3 courses in one month',
      icon: Target,
      earned: true,
      earnedDate: '2024-01-15'
    },
    {
      id: 3,
      title: '7-Day Streak',
      description: 'Study for 7 consecutive days',
      icon: Calendar,
      earned: true,
      earnedDate: '2024-01-20'
    },
    {
      id: 4,
      title: 'Top Performer',
      description: 'Achieve 90% average score',
      icon: Star,
      earned: false,
      earnedDate: null
    }
  ],
  recentActivity: [
    {
      id: 1,
      type: 'lesson_completed',
      description: 'Completed "Email Marketing Strategies"',
      course: 'Digital Marketing Fundamentals',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'certificate_earned',
      description: 'Earned certificate for Web Development Basics',
      course: 'Web Development Basics',
      timestamp: '2 days ago'
    },
    {
      id: 3,
      type: 'quiz_passed',
      description: 'Passed quiz with 85% score',
      course: 'Business Communication',
      timestamp: '3 days ago'
    }
  ]
}

export default function StudentDashboard() {
  const { isDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'achievements' | 'certificates'>('overview')

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'marketing':
        return 'bg-pink-500'
      case 'technology':
        return 'bg-blue-500'
      case 'business':
        return 'bg-green-500'
      case 'design':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson_completed':
        return PlayCircle
      case 'certificate_earned':
        return Award
      case 'quiz_passed':
        return Target
      default:
        return BookOpen
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
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                <p className="text-gray-600">Welcome back, {mockStudentData.profile.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                {mockStudentData.profile.totalPoints} Points
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                {mockStudentData.profile.currentLevel}
              </Badge>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'courses', label: 'My Courses', icon: PlayCircle },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'certificates', label: 'Certificates', icon: Award }
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
                      <BookOpen className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold">{mockStudentData.stats.coursesEnrolled}</div>
                        <p className="text-sm text-gray-600">Courses Enrolled</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Award className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold">{mockStudentData.stats.coursesCompleted}</div>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-8 w-8 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold">{mockStudentData.stats.totalHours}</div>
                        <p className="text-sm text-gray-600">Hours Studied</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Star className="h-8 w-8 text-yellow-600" />
                      <div>
                        <div className="text-2xl font-bold">{mockStudentData.stats.averageScore}%</div>
                        <p className="text-sm text-gray-600">Average Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Current Progress & Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Continue Learning</CardTitle>
                    <CardDescription>Pick up where you left off</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockStudentData.enrolledCourses
                        .filter(course => course.progress < 100)
                        .slice(0, 2)
                        .map((course) => (
                          <div key={course.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold">{course.title}</h3>
                              <Badge className={getCategoryColor(course.category)}>
                                {course.category}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                              <p className="text-sm text-gray-600">Next: {course.nextLesson}</p>
                            </div>
                            <Button size="sm" className="mt-3 w-full">
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Continue Learning
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest learning milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockStudentData.recentActivity.map((activity) => {
                        const Icon = getActivityIcon(activity.type)
                        return (
                          <div key={activity.id} className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Icon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium text-sm">{activity.description}</p>
                              <p className="text-xs text-gray-600">{activity.course}</p>
                              <p className="text-xs text-gray-500">{activity.timestamp}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Learning Streak */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Streak</CardTitle>
                  <CardDescription>Keep up the great work!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600">{mockStudentData.stats.currentStreak}</div>
                      <p className="text-sm text-gray-600">Days</p>
                    </div>
                    <div className="flex-grow">
                      <p className="text-lg font-semibold mb-2">🔥 Amazing streak!</p>
                      <p className="text-gray-600">You've been learning for {mockStudentData.stats.currentStreak} consecutive days. Keep it up!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Courses</h2>
                <Button>
                  Browse More Courses
                </Button>
              </div>

              <div className="space-y-4">
                {mockStudentData.enrolledCourses.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-gray-600" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold">{course.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getCategoryColor(course.category)}>
                                {course.category}
                              </Badge>
                              {course.certificate && (
                                <Badge variant="secondary">
                                  <Award className="h-3 w-3 mr-1" />
                                  Certified
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">Instructor: {course.instructor}</p>
                          
                          <div className="grid md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Progress</p>
                              <div className="flex items-center space-x-2">
                                <Progress value={course.progress} className="h-2 flex-grow" />
                                <span className="text-sm font-medium">{course.progress}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Lessons</p>
                              <p className="font-medium">{course.completedLessons}/{course.totalLessons}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Duration</p>
                              <p className="font-medium">{course.duration}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Rating</p>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="ml-1 font-medium">{course.rating}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t">
                            <p className="text-sm text-gray-600">
                              Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                            </p>
                            <div className="flex space-x-2">
                              {course.progress < 100 ? (
                                <Button>
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Continue Learning
                                </Button>
                              ) : (
                                <Button variant="outline">
                                  <Award className="h-4 w-4 mr-2" />
                                  View Certificate
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Achievements</h2>
                <p className="text-gray-600">
                  {mockStudentData.achievements.filter(a => a.earned).length} of {mockStudentData.achievements.length} earned
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mockStudentData.achievements.map((achievement) => {
                  const Icon = achievement.icon
                  return (
                    <Card key={achievement.id} className={achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${achievement.earned ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <Icon className={`h-6 w-6 ${achievement.earned ? 'text-white' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                            {achievement.earned && achievement.earnedDate && (
                              <p className="text-xs text-green-600 mt-1">
                                Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          {achievement.earned && (
                            <Badge className="bg-green-500">
                              <Award className="h-3 w-3 mr-1" />
                              Earned
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Certificates</h2>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>

              <div className="space-y-4">
                {mockStudentData.enrolledCourses
                  .filter(course => course.certificate)
                  .map((course) => (
                    <Card key={course.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Award className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold">{course.title}</h3>
                            <p className="text-gray-600">Instructor: {course.instructor}</p>
                            <p className="text-sm text-gray-500">
                              Completed on {new Date(course.lastAccessed).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                            <Button>
                              View Certificate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {mockStudentData.enrolledCourses.filter(course => course.certificate).length === 0 && (
                <div className="text-center py-12">
                  <Award className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
                  <p className="text-gray-600 mb-4">Complete courses to earn certificates</p>
                  <Button>Browse Courses</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
