import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Battery, 
  Zap, 
  Sun, 
  Leaf, 
  BarChart3, 
  MapPin, 
  Clock, 
  BatteryCharging, 
  PlayCircle,
  CheckCircle,
  ArrowRight,
  Users,
  Globe,
  TrendingUp,
  Shield,
  Smartphone,
  CreditCard,
  Timer,
  DollarSign,
  Star,
  Video,
  Image as ImageIcon,
  Play,
  X
} from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import MediaGallery from '../components/MediaGallery'
import { useTheme } from '@/contexts/ThemeContext'

const heroStats = [
  { value: "50+", label: "Charging Stations", icon: <Zap className="h-6 w-6" /> },
  { value: "10,000+", label: "Happy Customers", icon: <Users className="h-6 w-6" /> },
  { value: "100%", label: "Solar Powered", icon: <Sun className="h-6 w-6" /> },
  { value: "24/7", label: "Available", icon: <Clock className="h-6 w-6" /> }
]

const mediaGallery = [
  {
    type: 'image',
    src: '/placeholder.svg?text=ZavCharge+Station&width=800&height=600',
    alt: 'ZavCharge Solar Charging Station',
    title: 'Solar-Powered Charging Station',
    orientation: 'landscape',
    aspectRatio: 16/9
  },
  {
    type: 'image',
    src: '/placeholder.svg?text=Charging+Process&width=600&height=800',
    alt: 'Device Charging Process',
    title: 'Smart Charging Technology',
    orientation: 'portrait',
    aspectRatio: 3/4
  },
  {
    type: 'video',
    src: '/placeholder.mp4',
    thumbnail: '/placeholder.svg?text=Video+Thumbnail&width=800&height=600',
    alt: 'ZavCharge Demo Video',
    title: 'How ZavCharge Works',
    orientation: 'landscape',
    aspectRatio: 16/9
  },
  {
    type: 'image',
    src: '/placeholder.svg?text=Network+Map&width=600&height=800',
    alt: 'ZavCharge Network Map',
    title: 'Nationwide Network Coverage',
    orientation: 'portrait',
    aspectRatio: 3/4
  },
  {
    type: 'video',
    src: '/placeholder.mp4',
    thumbnail: '/placeholder.svg?text=Installation+Video&width=800&height=600',
    alt: 'Installation Process',
    title: 'Quick Installation Process',
    orientation: 'landscape',
    aspectRatio: 16/9
  },
  {
    type: 'image',
    src: '/placeholder.svg?text=App+Interface&width=600&height=800',
    alt: 'ZavCharge Mobile App',
    title: 'Mobile App Interface',
    orientation: 'portrait',
    aspectRatio: 3/4
  },
  {
    type: 'image',
    src: '/placeholder.svg?text=Solar+Panel&width=800&height=600',
    alt: 'Solar Panel Installation',
    title: 'Advanced Solar Technology',
    orientation: 'landscape',
    aspectRatio: 16/9
  },
  {
    type: 'image',
    src: '/placeholder.svg?text=User+Experience&width=600&height=800',
    alt: 'User Experience',
    title: 'Seamless User Experience',
    orientation: 'portrait',
    aspectRatio: 3/4
  }
]

const investmentTiers = [
  {
    name: 'Starter',
    amount: 100000,
    shares: '0.1%',
    benefits: ['Quarterly ROI of 8-12%', 'Early product access', 'Investor updates'],
    color: 'bg-blue-500'
  },
  {
    name: 'Growth',
    amount: 500000,
    shares: '0.6%',
    benefits: ['Quarterly ROI of 12-18%', 'Premium product access', 'Monthly investor calls', 'Special recognition'],
    color: 'bg-purple-500'
  },
  {
    name: 'Premium',
    amount: 1000000,
    shares: '1.3%',
    benefits: ['Quarterly ROI of 18-25%', 'VIP product access', 'Direct founder access', 'Board meeting invites', 'Special advisory role'],
    color: 'bg-gold-500'
  }
]

const problems = [
  {
    title: "Limited Charging Infrastructure",
    description: "Nigeria has no public open energy access (charging stations) for a population of 200+ million people.",
    icon: <MapPin className="h-12 w-12 text-red-500" />
  },
  {
    title: "Unreliable Power Grid",
    description: "Frequent power outages make traditional charging unreliable and unpredictable.",
    icon: <Zap className="h-12 w-12 text-red-500" />
  },
  {
    title: "Energy Restricted to Indoor Acess",
    description: "For over a decade, grid electricity has been restricted to indoor spaces, accessible only to authorized personnel for powering or charging devices. This limitation has left many people stranded or missing opportunities because energy access is not public. Open energy access through public charging stations provides individuals with the freedom to charge their devices whenever the need arises, on the go.",
    icon: <TrendingUp className="h-12 w-12 text-red-500" />
  },
  {
    title: "Environmental Impact",
    description: "Most charging relies on fossil fuel-powered grid electricity, providing no public open energy access (charging stations) for environmental and individual benefits.",
    icon: <Leaf className="h-12 w-12 text-red-500" />
  }
]

const solutions = [
  {
    title: "Solar-Powered Network",
    description: "100% solar-powered charging stations that operate independently of the unreliable grid.",
    icon: <Sun className="h-12 w-12 text-green-500" />,
    features: ["Grid-independent operation", "24/7 availability", "Zero carbon emissions", "Lower operating costs"]
  },
  {
    title: "Smart Charging Technology",
    description: "AI-powered charging optimization for faster, more efficient charging experiences.",
    icon: <Smartphone className="h-12 w-12 text-blue-500" />,
    features: ["Mobile app control", "Real-time monitoring", "Predictive maintenance", "Usage analytics"]
  },
  {
    title: "Flexible Payment Options",
    description: "Multiple payment methods including mobile money, cards, and subscription plans.",
    icon: <CreditCard className="h-12 w-12 text-purple-500" />,
    features: ["Pay-per-use", "Monthly subscriptions", "Corporate accounts", "Mobile payments"]
  },
  {
    title: "Rapid Deployment",
    description: "Quick installation and setup with minimal infrastructure requirements.",
    icon: <Timer className="h-12 w-12 text-orange-500" />,
    features: ["Modular design", "Quick installation", "Scalable network", "Remote monitoring"]
  }
]

const networkStats = [
  { 
    category: "Network Growth",
    stats: [
      { label: "Charging Sessions", value: "50,000+", change: "+145%" },
      { label: "Energy Delivered", value: "2.5 GWh", change: "+200%" },
      { label: "CO₂ Saved", value: "1,200 tons", change: "+180%" },
      { label: "Network Uptime", value: "99.8%", change: "+2%" }
    ]
  },
  {
    category: "Customer Satisfaction", 
    stats: [
      { label: "App Rating", value: "4.9/5", change: "+5%" },
      { label: "Repeat Usage", value: "85%", change: "+12%" },
      { label: "Avg. Session", value: "45 min", change: "-10%" },
      { label: "Support Rating", value: "4.8/5", change: "+8%" }
    ]
  },
  {
    category: "Business Impact",
    stats: [
      { label: "Partner Locations", value: "120", change: "+300%" },
      { label: "Monthly Revenue", value: "₦25M", change: "+250%" },
      { label: "Jobs Created", value: "200+", change: "+150%" },
      { label: "Franchise Requests", value: "50+", change: "+400%" }
    ]
  }
]

const roadmapItems = [
  {
    phase: "Phase 1 - Foundation",
    period: "Q4-Q1 2025/26",
    status: "completed",
    items: [
      "Launch 50 charging stations in Ibadan",
      "Mobile app development",
      "Payment system integration", 
      "Customer support setup"
    ]
  },
  {
    phase: "Phase 2 - Expansion",
    period: "Q2-Q4 2026",
    status: "in-progress",
    items: [
      "Expand to Abuja and Lagos",
      "Corporate partnership program",
      "Subscription service launch",
      "Fleet management solutions"
    ]
  },
  {
    phase: "Phase 3 - Scale",
    period: "Q1-Q2 2027",
    status: "planned",
    items: [
      "500+ stations across Nigeria",
      "International expansion planning",
      "Advanced analytics platform",
      "Franchise program launch"
    ]
  },
  {
    phase: "Phase 4 - Innovation",
    period: "Q3-Q4 2027",
    status: "planned",
    items: [
      "Open Energy Access charging Station across streets",
      "AI-powered demand prediction",
      "Carbon credit marketplace"
    ]
  }
]

export default function ZavChargeProduct() {
  const { isDarkMode } = useTheme()
  const [selectedStat, setSelectedStat] = useState(0)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState(investmentTiers[0])
  const [investmentForm, setInvestmentForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    amount: selectedTier.amount,
    message: ''
  })
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in-progress':
        return 'bg-blue-500'
      case 'planned':
        return 'bg-gray-400'
      default:
        return 'bg-gray-300'
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              🚀 Nigeria's First Solar Open Energy Access Charging Network
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              Power Your Journey
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Sustainably
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
              Revolutionary solar-powered charging network bringing clean, reliable, 
              and affordable charging solutions across Nigeria.
            </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Dialog open={isInvestmentModalOpen} onOpenChange={setIsInvestmentModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600">
                      <DollarSign className="mr-2 h-5 w-5" />
                      Invest Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Invest in ZavCharge - Early Investor Opportunity</DialogTitle>
                      <DialogDescription>
                        Join the renewable energy revolution and earn attractive returns as an early investor in Nigeria's first solar charging network.
                      </DialogDescription>
                    </DialogHeader>
                    
                    {!paymentConfirmed ? (
                      <div className="space-y-6">
                        {/* Investment Tiers */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Choose Your Investment Tier</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {investmentTiers.map((tier) => (
                              <Card 
                                key={tier.name}
                                className={`cursor-pointer transition-all ${
                                  selectedTier.name === tier.name ? 'ring-2 ring-orange-500' : ''
                                }`}
                                onClick={() => {
                                  setSelectedTier(tier)
                                  setInvestmentForm(prev => ({ ...prev, amount: tier.amount }))
                                }}
                              >
                                <CardHeader className="text-center">
                                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                                  <div className="text-2xl font-bold text-green-600">
                                    ₦{tier.amount.toLocaleString()}
                                  </div>
                                  <Badge variant="secondary">{tier.shares} Equity</Badge>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2 text-sm">
                                    {tier.benefits.map((benefit, idx) => (
                                      <li key={idx} className="flex items-start">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        {benefit}
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Investment Form */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Investor Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Full Name *</Label>
                              <Input
                                id="name"
                                value={investmentForm.name}
                                onChange={(e) => setInvestmentForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter your full name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email Address *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={investmentForm.email}
                                onChange={(e) => setInvestmentForm(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="Enter your email"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number *</Label>
                              <Input
                                id="phone"
                                value={investmentForm.phone}
                                onChange={(e) => setInvestmentForm(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="Enter your phone number"
                              />
                            </div>
                            <div>
                              <Label htmlFor="company">Company (Optional)</Label>
                              <Input
                                id="company"
                                value={investmentForm.company}
                                onChange={(e) => setInvestmentForm(prev => ({ ...prev, company: e.target.value }))}
                                placeholder="Enter your company name"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="message">Additional Message (Optional)</Label>
                            <Textarea
                              id="message"
                              value={investmentForm.message}
                              onChange={(e) => setInvestmentForm(prev => ({ ...prev, message: e.target.value }))}
                              placeholder="Tell us why you're interested in investing..."
                              rows={3}
                            />
                          </div>
                        </div>

                        {/* Investment Summary */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Investment Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Tier:</span>
                              <span className="font-medium">{selectedTier.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Investment Amount:</span>
                              <span className="font-medium">₦{selectedTier.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Equity Share:</span>
                              <span className="font-medium">{selectedTier.shares}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expected Quarterly ROI:</span>
                              <span className="font-medium text-green-600">
                                {selectedTier.name === 'Starter' ? '8-12%' : 
                                 selectedTier.name === 'Growth' ? '12-18%' : '18-25%'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Button */}
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={!investmentForm.name || !investmentForm.email || !investmentForm.phone}
                          onClick={() => {
                            // Here you would integrate with your payment gateway
                            // For now, we'll simulate payment confirmation
                            setTimeout(() => {
                              setPaymentConfirmed(true)
                            }, 2000)
                          }}
                        >
                          <CreditCard className="mr-2 h-5 w-5" />
                          Proceed to Payment - ₦{selectedTier.amount.toLocaleString()}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center space-y-4 py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-green-600 mb-2">Payment Required</h3>
                          <p className="text-gray-600 mb-4">
                            To complete your investment application, please make payment and confirm below.
                          </p>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-yellow-800">
                              Your investment form will only be processed after payment confirmation. 
                              Please ensure payment is completed before submission.
                            </p>
                          </div>
                          <Button 
                            onClick={() => {
                              // Reset form
                              setPaymentConfirmed(false)
                              setIsInvestmentModalOpen(false)
                              setInvestmentForm({
                                name: '',
                                email: '',
                                phone: '',
                                company: '',
                                amount: selectedTier.amount,
                                message: ''
                              })
                            }}
                            className="w-full"
                          >
                            Complete Payment & Submit Application
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                  onClick={() => setSelectedMedia(mediaGallery[0])}
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  View Media Gallery
                </Button>
    </div>
        </motion.div>


          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {heroStats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-6 text-center">
                  <div className="flex justify-center mb-3 text-yellow-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      <main className="flex-grow">
        {/* Media Gallery Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                See ZavCharge in Action
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explore our innovative solar charging technology through images and videos showcasing the future of renewable energy access in Nigeria.
              </p>
            </motion.div>

            <MediaGallery 
              media={mediaGallery}
              onMediaClick={setSelectedMedia}
              className="max-w-6xl mx-auto"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button 
                size="lg" 
                onClick={() => setSelectedMedia(mediaGallery[0])}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Open Full Gallery
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                The Open Energy Access
                <span className="block text-red-500">Challenge in Nigeria</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Despite the growing interest in electric appliances, Nigeria faces significant 
                infrastructure and reliability challenges that ZavCharge is solving.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">{problem.icon}</div>
                        <div>
                          <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{problem.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Problem Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-red-600 mb-2">&lt;20</div>
                  <p className="text-gray-700 dark:text-gray-300">Public charging stations nationwide</p>
                </CardContent>
              </Card>
              <Card className="text-center bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-orange-600 mb-2">40%</div>
                  <p className="text-gray-700 dark:text-gray-300">Average daily power outage time</p>
                </CardContent>
              </Card>
              <Card className="text-center bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">200M+</div>
                  <p className="text-gray-700 dark:text-gray-300">People without reliable charging access</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Our
                <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Revolutionary Solutions
                </span>
              </h2>
              <p className="text-xl text-ash-600 dark:text-ash-300 max-w-3xl mx-auto">
                ZavCharge addresses every challenge with innovative, sustainable, and scalable solutions 
                designed specifically for the Nigerian market.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="pt-6">
                      <div className="text-center mb-6">
                        <div className="inline-flex p-4 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:scale-110 transition-transform duration-300">
                          {solution.icon}
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold mb-4 text-center">{solution.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">{solution.description}</p>
                      <ul className="space-y-2">
                        {solution.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Dashboard */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Real-Time Network
                <span className="block text-blue-600">Performance</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Live data from our growing network shows the positive impact we're making 
                on Nigeria's sustainable transportation future.
              </p>
            </motion.div>

            {/* Statistics Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {networkStats.map((category, index) => (
                <Button
                  key={index}
                  variant={selectedStat === index ? "default" : "outline"}
                  onClick={() => setSelectedStat(index)}
                  className="mb-2"
                >
                  {category.category}
                </Button>
              ))}
            </div>

            {/* Statistics Display */}
            <motion.div
              key={selectedStat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {networkStats[selectedStat].stats.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {stat.label}
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {stat.change}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Our Growth
                <span className="block text-purple-600">Roadmap</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Strategic expansion plan to make ZavCharge the leading Open Energy Access charging network 
                across Nigeria and beyond.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {roadmapItems.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={getStatusColor(phase.status)}>
                          {phase.status.replace('-', ' ')}
                        </Badge>
                        <span className="text-sm text-gray-500">{phase.period}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-4">{phase.phase}</h3>
                      <ul className="space-y-2">
                        {phase.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Power the Future?
              </h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Join thousands of forward-thinking Nigerians who are already part of the 
                Open Energy Acesss revolution with ZavCharge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                  <MapPin className="mr-2 h-5 w-5" />
                  Find Nearest Station
                </Button>
                <Dialog open={isInvestmentModalOpen} onOpenChange={setIsInvestmentModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600">
                      <DollarSign className="mr-2 h-5 w-5" />
                      Invest Now
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Media Gallery Modal */}
      {selectedMedia && (
        <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader className="pb-4">
              <DialogTitle>ZavCharge Media Gallery</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Main Media Display */}
              <div className="lg:col-span-2 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {selectedMedia.type === 'image' ? (
                  <img 
                    src={selectedMedia.src} 
                    alt={selectedMedia.alt}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video 
                      controls 
                      className="max-w-full max-h-full"
                      poster={selectedMedia.thumbnail}
                    >
                      <source src={selectedMedia.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
              
              {/* Media Thumbnails */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Gallery</h3>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {mediaGallery.map((media, index) => (
                    <div 
                      key={index}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedMedia === media ? 'border-orange-500' : 'border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedMedia(media)}
                    >
                      <img 
                        src={media.type === 'video' ? media.thumbnail : media.src}
                        alt={media.alt}
                        className="w-full h-20 object-cover"
                      />
                      {media.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1">
                        <div className="text-xs truncate">{media.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Media Info */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{selectedMedia.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedMedia.type === 'image' ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : (
                      <Video className="h-4 w-4" />
                    )}
                    <span className="capitalize">{selectedMedia.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
