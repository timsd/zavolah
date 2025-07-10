import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Download, BookOpen, GraduationCap, Newspaper, ChevronRight, Users, Clock, Award, PlayCircle, CheckCircle, X } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useTheme } from '@/contexts/ThemeContext'

const topics = [
  {
    title: "Backup Power Solutions",
    icon: "⚡",
    description: "Learn about reliable backup power systems for homes and businesses",
    subtopics: [
      { 
        title: "The Need for Backup Power", 
        content: "In an increasingly electrified world, power outages can disrupt daily life and business operations. Backup power solutions ensure continuity during grid failures, protecting your home or business from unexpected downtime.",
        duration: "15 min read"
      },
      { 
        title: "How to Order a Backup System", 
        content: "Ordering a backup power system is easy with Zavolah. Start by scheduling a consultation with our experts. We'll assess your power needs, design a custom solution, and guide you through the installation process.",
        duration: "20 min read"
      },
      { 
        title: "Maintenance and Support", 
        content: "Zavolah provides comprehensive maintenance and support for all backup power systems. Our team offers regular check-ups, remote monitoring, and 24/7 customer support to ensure your system is always ready when you need it.",
        duration: "12 min read"
      }
    ]
  },
  {
    title: "Solar Panels",
    icon: "☀️",
    description: "Master the fundamentals of solar energy systems",
    subtopics: [
      { 
        title: "Why Go Solar", 
        content: "Solar energy is clean, renewable, and increasingly affordable. By going solar, you reduce your carbon footprint, lower your energy bills, and increase your energy independence.",
        duration: "18 min read"
      },
      { 
        title: "How Solar Panels Work", 
        content: "Solar panels convert sunlight into electricity through photovoltaic cells. This DC electricity is then converted to AC for home use. Excess energy can be stored in batteries or fed back into the grid.",
        duration: "25 min read"
      },
      { 
        title: "Solar Savings Calculator", 
        content: "Solar savings vary based on your location, energy usage, and system size. On average, homeowners can save 20-30% on their energy bills, with some achieving complete energy independence.",
        duration: "10 min read"
      },
      { 
        title: "Solar Financing Options", 
        content: "Zavolah offers various financing options including outright purchase, solar loans, and power purchase agreements (PPAs). Our team can help you choose the best option for your financial situation.",
        duration: "15 min read"
      }
    ]
  },
  {
    title: "Smart Furniture",
    icon: "🪑",
    description: "Explore innovative furniture solutions for modern living",
    subtopics: [
      { 
        title: "Benefits of Smart Furniture", 
        content: "Smart furniture combines aesthetics with functionality, offering features like built-in charging stations, adjustable settings, and integration with smart home systems for enhanced comfort and convenience.",
        duration: "14 min read"
      },
      { 
        title: "Our Smart Furniture Range", 
        content: "Zavolah's smart furniture collection includes adjustable beds, smart desks, IoT-enabled sofas, and more. Each piece is designed to optimize your living space and improve your daily life.",
        duration: "22 min read"
      },
      { 
        title: "Customization Options", 
        content: "We offer extensive customization options for our smart furniture. From materials and colors to specific smart features, you can tailor each piece to your exact needs and preferences.",
        duration: "16 min read"
      }
    ]
  },
  {
    title: "Space-Saving Furniture",
    icon: "📐",
    description: "Maximize your living space with innovative design solutions",
    subtopics: [
      { 
        title: "Maximizing Small Spaces", 
        content: "Our space-saving furniture is perfect for small apartments, tiny homes, or any space where efficiency is key. We offer innovative solutions like murphy beds, expandable tables, and modular storage systems.",
        duration: "20 min read"
      },
      { 
        title: "Multi-Functional Designs", 
        content: "Zavolah's multi-functional furniture serves multiple purposes, such as coffee tables that convert to dining tables, or ottomans with hidden storage. These pieces help you make the most of every square foot.",
        duration: "18 min read"
      }
    ]
  },
  {
    title: "Tiny Homes",
    icon: "🏠",
    description: "Discover the minimalist lifestyle with tiny home solutions",
    subtopics: [
      { 
        title: "The Tiny Home Movement", 
        content: "Tiny homes offer a minimalist, eco-friendly lifestyle. They're perfect for those looking to downsize, reduce their environmental impact, or embrace a more mobile lifestyle.",
        duration: "25 min read"
      },
      { 
        title: "Zavolah's Tiny Home Solutions", 
        content: "We offer complete tiny home solutions, from design to construction. Our homes are energy-efficient, incorporate smart technology, and are built with sustainable materials.",
        duration: "30 min read"
      }
    ]
  },
  {
    title: "Smart Homes",
    icon: "🏡",
    description: "Build intelligent, connected living spaces",
    subtopics: [
      { 
        title: "Introduction to Smart Homes", 
        content: "A smart home uses internet-connected devices to enable remote monitoring and management of appliances and systems. This technology enhances comfort, efficiency, and security.",
        duration: "20 min read"
      },
      { 
        title: "Zavolah's Smart Home Ecosystem", 
        content: "Our smart home solutions integrate seamlessly with our backup power and solar systems. Control lighting, climate, security, and energy usage from a single, user-friendly interface.",
        duration: "35 min read"
      },
      { 
        title: "Energy Management", 
        content: "Zavolah's smart home system includes advanced energy management features. Monitor your energy usage in real-time, optimize consumption, and reduce your carbon footprint.",
        duration: "28 min read"
      }
    ]
  }
]

const resources = [
  { title: "Backup Power Complete Guide", url: "#", category: "Backup Power Solutions", size: "2.5 MB", type: "PDF" },
  { title: "Solar Installation Manual", url: "#", category: "Solar Panels", size: "4.1 MB", type: "PDF" },
  { title: "Smart Furniture Catalog", url: "#", category: "Smart Furniture", size: "8.2 MB", type: "PDF" },
  { title: "Space-Saving Design Guide", url: "#", category: "Space-Saving Furniture", size: "1.8 MB", type: "PDF" },
  { title: "Tiny Home Planning Toolkit", url: "#", category: "Tiny Homes", size: "3.4 MB", type: "ZIP" },
  { title: "Smart Home Setup Manual", url: "#", category: "Smart Homes", size: "5.7 MB", type: "PDF" }
]

const careers = [
  { 
    title: "Solar Installation Intern", 
    department: "Renewable Energy", 
    type: "Internship",
    location: "Lagos, Nigeria",
    description: "Learn hands-on solar installation techniques"
  },
  { 
    title: "Energy Systems Engineer", 
    department: "Renewable Energy", 
    type: "Full-time",
    location: "Abuja, Nigeria",
    description: "Design and optimize renewable energy systems"
  },
  { 
    title: "Furniture Design Intern", 
    department: "Smart Furniture", 
    type: "Internship",
    location: "Lagos, Nigeria",
    description: "Create innovative furniture solutions"
  },
  { 
    title: "Smart Home Technician", 
    department: "Smart Homes", 
    type: "Full-time",
    location: "Port Harcourt, Nigeria",
    description: "Install and maintain smart home systems"
  },
  { 
    title: "Construction Project Manager", 
    department: "Construction", 
    type: "Full-time",
    location: "Kano, Nigeria",
    description: "Oversee construction projects from start to finish"
  }
]

const trainings = [
  { 
    title: "Industrial Training Program for Engineering Students", 
    duration: "3 months",
    level: "Beginner",
    students: 45,
    description: "Comprehensive hands-on training for engineering students"
  },
  { 
    title: "Furniture Design and Construction Workshop", 
    duration: "6 weeks",
    level: "Intermediate",
    students: 28,
    description: "Learn modern furniture design and construction techniques"
  },
  { 
    title: "Building Project Setting Out Course", 
    duration: "4 weeks",
    level: "Beginner",
    students: 35,
    description: "Master the fundamentals of construction project layout"
  },
  { 
    title: "Advanced Building Drawing and CAD", 
    duration: "8 weeks",
    level: "Advanced",
    students: 22,
    description: "Professional-level architectural drawing and CAD skills"
  },
  { 
    title: "Solar Installation Certification", 
    duration: "6 weeks",
    level: "Intermediate",
    students: 41,
    description: "Get certified in solar panel installation and maintenance"
  },
  { 
    title: "Smart Home Integration Masterclass", 
    duration: "4 weeks",
    level: "Advanced",
    students: 19,
    description: "Advanced smart home system design and integration"
  }
]

const blogPosts = [
  {
    title: "The Future of Renewable Energy in Nigeria",
    excerpt: "Exploring the potential and challenges of renewable energy adoption across Nigeria...",
    author: "Dr. Adebayo Ogundimu",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Energy"
  },
  {
    title: "Smart Furniture Trends for 2024",
    excerpt: "Discover the latest innovations in smart furniture design and technology...",
    author: "Sarah Okafor",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Design"
  },
  {
    title: "Building Sustainable Homes on a Budget",
    excerpt: "Practical tips for incorporating sustainable features into your home construction...",
    author: "Eng. Michael Okwu",
    date: "2024-01-05",
    readTime: "10 min read",
    category: "Construction"
  }
]

export default function Academy() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0])
  const [selectedSubtopic, setSelectedSubtopic] = useState(topics[0].subtopics[0])
  const { isDarkMode } = useTheme()
  const [progress, setProgress] = useState(65)
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const { toast } = useToast()

  const handleTopicSelect = (topic: any) => {
    setSelectedTopic(topic)
    setSelectedSubtopic(topic.subtopics[0])
  }

  const generateQuiz = (topic: any, subtopic: any) => {
    // Auto-generate quiz questions based on topic and subtopic content
    const questions = []
    
    // Extract key concepts from the content
    const content = subtopic.content
    const topicTitle = topic.title
    const subtopicTitle = subtopic.title
    
    // Generate questions based on the topic
    switch (topicTitle) {
      case "Solar Panels":
        questions.push(
          {
            question: `What is the main benefit of ${subtopicTitle}?`,
            options: [
              "Reduces carbon footprint and energy bills",
              "Increases home value only",
              "Works only in sunny weather",
              "Requires no maintenance"
            ],
            correct: 0
          },
          {
            question: "How do solar panels convert sunlight into electricity?",
            options: [
              "Through thermal heating",
              "Through photovoltaic cells",
              "Through wind power",
              "Through battery storage"
            ],
            correct: 1
          },
          {
            question: "What happens to excess solar energy?",
            options: [
              "It is wasted",
              "It powers the neighborhood",
              "It can be stored in batteries or fed back to the grid",
              "It automatically shuts down"
            ],
            correct: 2
          }
        )
        break
      
      case "Backup Power Solutions":
        questions.push(
          {
            question: `Why is ${subtopicTitle} important?`,
            options: [
              "To save money on electricity",
              "To ensure continuity during grid failures",
              "To increase home decoration",
              "To reduce internet usage"
            ],
            correct: 1
          },
          {
            question: "What does Zavolah provide for backup power systems?",
            options: [
              "Only installation services",
              "Comprehensive maintenance and 24/7 support",
              "Monthly newsletters",
              "Decorative panels"
            ],
            correct: 1
          }
        )
        break
      
      case "Smart Furniture":
        questions.push(
          {
            question: `What makes ${subtopicTitle} special?`,
            options: [
              "It's always expensive",
              "It combines aesthetics with functionality",
              "It requires no electricity",
              "It's only for offices"
            ],
            correct: 1
          },
          {
            question: "What features can smart furniture include?",
            options: [
              "Only charging stations",
              "Built-in charging stations, adjustable settings, and smart home integration",
              "Only decorative elements",
              "Only storage space"
            ],
            correct: 1
          }
        )
        break
      
      default:
        // Generic questions for other topics
        questions.push(
          {
            question: `What is the main focus of ${subtopicTitle}?`,
            options: [
              "Cost reduction only",
              "Improving efficiency and sustainability",
              "Decoration purposes",
              "Entertainment value"
            ],
            correct: 1
          },
          {
            question: `How does Zavolah support ${topicTitle}?`,
            options: [
              "Through online articles only",
              "Through comprehensive solutions and expert support",
              "Through basic installation only",
              "Through email newsletters"
            ],
            correct: 1
          }
        )
    }
    
    // Add a general question about Zavolah
    questions.push({
      question: "What is Zavolah's mission?",
      options: [
        "To sell expensive products",
        "To provide sustainable energy and smart living solutions",
        "To replace all traditional furniture",
        "To focus only on solar panels"
      ],
      correct: 1
    })
    
    return {
      title: `${subtopicTitle} Quiz`,
      topic: topicTitle,
      subtopic: subtopicTitle,
      questions: questions.slice(0, 3) // Limit to 3 questions
    }
  }

  const handleTakeQuiz = () => {
    const quiz = generateQuiz(selectedTopic, selectedSubtopic)
    setCurrentQuiz(quiz)
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setUserAnswers([])
    setShowResults(false)
    setQuizScore(0)
    setIsQuizModalOpen(true)
  }

  const handleAnswerSelect = (answerIndex: string) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    const newAnswers = [...userAnswers, selectedAnswer]
    setUserAnswers(newAnswers)
    
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
    } else {
      // Quiz completed, calculate score
      const score = newAnswers.reduce((total, answer, index) => {
        return total + (parseInt(answer) === currentQuiz.questions[index].correct ? 1 : 0)
      }, 0)
      setQuizScore(score)
      setShowResults(true)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setUserAnswers([])
    setShowResults(false)
    setQuizScore(0)
  }

  const handleCloseQuiz = () => {
    setIsQuizModalOpen(false)
    if (quizScore >= 2) {
      toast({
        title: "Great job!",
        description: `You scored ${quizScore}/${currentQuiz.questions.length} on the ${currentQuiz.title}`,
      })
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}>
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
              Zavolah Academy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Master renewable energy, smart furniture design, and sustainable construction through our comprehensive learning platform
            </p>
          </motion.div>
        </div>

        {/* Learning Progress */}
        <Card className="mb-8 bg-gradient-to-r from-orange-50 to-green-50 dark:from-gray-800 dark:to-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Your Learning Progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You're doing great! Keep up the momentum.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{progress}%</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Main Learning Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Learn</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Topics Sidebar */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Learning Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <Accordion type="single" collapsible className="space-y-2">
                    {topics.map((topic, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg">
                        <AccordionTrigger 
                          className="px-4 hover:no-underline"
                          onClick={() => handleTopicSelect(topic)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{topic.icon}</span>
                            <div className="text-left">
                              <div className="font-medium">{topic.title}</div>
                              <div className="text-sm text-gray-500">{topic.subtopics.length} lessons</div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{topic.description}</p>
                          <ul className="space-y-2">
                            {topic.subtopics.map((subtopic, subIndex) => (
                              <li key={subIndex}>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="w-full justify-start text-left h-auto p-2"
                                  onClick={() => {
                                    setSelectedTopic(topic)
                                    setSelectedSubtopic(subtopic)
                                  }}
                                >
                                  <div>
                                    <div className="text-sm font-medium">{subtopic.title}</div>
                                    <div className="text-xs text-gray-500">{subtopic.duration}</div>
                                  </div>
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Main Content Area */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedSubtopic.title}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <Clock className="mr-2 h-4 w-4" />
                      {selectedSubtopic.duration}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{selectedTopic.title}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed mb-6">{selectedSubtopic.content}</p>
                  
                  {/* Video Placeholder */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center mb-6">
                    <PlayCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium mb-2">Video Lesson</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Interactive video content coming soon
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6 border-t">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Mark as Complete
                    </Button>
                    <Button variant="outline" onClick={handleTakeQuiz}>
                      Take Quiz
                    </Button>
                    <Button variant="outline">
                      Download Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Academy Resources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Academy Resources</h2>
          <Tabs defaultValue="resources" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="resources" className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="careers" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Careers
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center">
                <GraduationCap className="mr-2 h-4 w-4" />
                Training
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center">
                <Newspaper className="mr-2 h-4 w-4" />
                Blog
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resources">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <Badge variant="secondary">{resource.type}</Badge>
                        <span>{resource.size}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="careers">
              <div className="space-y-6">
                {careers.map((career, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{career.title}</CardTitle>
                          <CardDescription className="mt-2">{career.description}</CardDescription>
                        </div>
                        <Badge variant={career.type === 'Full-time' ? 'default' : 'secondary'}>
                          {career.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Department:</span> {career.department}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {career.location}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-orange-500 hover:bg-orange-600">Apply Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="training">
              <div className="space-y-6">
                {trainings.map((training, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{training.title}</CardTitle>
                          <CardDescription className="mt-2">{training.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{training.level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-gray-400" />
                          {training.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-gray-400" />
                          {training.students} students
                        </div>
                        <div className="flex items-center">
                          <Award className="mr-2 h-4 w-4 text-gray-400" />
                          Certificate
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-green-600 hover:bg-green-700">Enroll Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Why Choose Zavolah Training?</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Real-World Experience</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Apply classroom knowledge in real-world settings to solidify your skills
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Industry Connections</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Connect with industry professionals and gain valuable insights
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Practical Confidence</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Build practical experience that gives you confidence to excel
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Career Support</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Get career guidance and job placement assistance after completion
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog">
              <div className="space-y-6">
                {blogPosts.map((post, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                          <CardDescription>{post.excerpt}</CardDescription>
                        </div>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <span>By {post.author}</span>
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline">
                        Read More <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button 
                  size="lg"
                  onClick={() => window.open('https://paragraph.xyz/@zavolah', '_blank')}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Visit Our Blog on Paragraph.xyz
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Community Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-orange-500 to-green-600 text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Join Our Learning Community</h2>
                  <p className="text-lg mb-6 opacity-90">
                    Become a Zavolah Energy Pioneer and connect with like-minded individuals passionate about sustainable technology and innovation.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Early access to new courses and content
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Exclusive webinars and events
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Networking with industry experts
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Discounts on products and services
                    </li>
                  </ul>
                  <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                    Join Community
                  </Button>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 rounded-full mb-4">
                    <Users className="h-16 w-16" />
                  </div>
                  <div className="text-2xl font-bold">2,500+</div>
                  <div className="opacity-90">Active Learners</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Quiz Modal */}
      <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentQuiz?.title}</DialogTitle>
            <DialogDescription>
              Test your knowledge on {currentQuiz?.subtopic}
            </DialogDescription>
          </DialogHeader>
          
          {currentQuiz && (
            <div className="space-y-6">
              {!showResults ? (
                <>
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
                      <span>{Math.round(((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100)}%</span>
                    </div>
                    <Progress value={((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100} />
                  </div>
                  
                  {/* Question */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      {currentQuiz.questions[currentQuestionIndex].question}
                    </h3>
                    
                    <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                      {currentQuiz.questions[currentQuestionIndex].options.map((option: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsQuizModalOpen(false)}
                    >
                      Close Quiz
                    </Button>
                    <Button 
                      onClick={handleNextQuestion}
                      disabled={!selectedAnswer}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Results */}
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      {quizScore >= 2 ? (
                        <CheckCircle className="h-16 w-16 text-green-600" />
                      ) : (
                        <X className="h-16 w-16 text-red-500" />
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold">
                      {quizScore >= 2 ? 'Great Job!' : 'Keep Learning!'}
                    </h3>
                    
                    <div className="text-lg">
                      Your Score: <span className="font-bold text-green-600">{quizScore}/{currentQuiz.questions.length}</span>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Quiz Summary:</h4>
                      <ul className="text-sm space-y-1">
                        {currentQuiz.questions.map((question: any, index: number) => (
                          <li key={index} className="flex items-center">
                            {parseInt(userAnswers[index]) === question.correct ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            ) : (
                              <X className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            Question {index + 1}: {parseInt(userAnswers[index]) === question.correct ? 'Correct' : 'Incorrect'}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {quizScore >= 2 && (
                      <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                        <p className="text-green-800 dark:text-green-200">
                          🎉 Congratulations! You've mastered this topic. Ready for the next lesson?
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Results Actions */}
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleRestartQuiz}>
                      Retake Quiz
                    </Button>
                    <Button 
                      onClick={handleCloseQuiz}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Continue Learning
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
