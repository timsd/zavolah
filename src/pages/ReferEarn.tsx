import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Gift, 
  Users, 
  DollarSign, 
  Share2, 
  Trophy, 
  CheckCircle,
  ArrowRight,
  Smartphone,
  Mail,
  MessageSquare,
  Copy,
  Star,
  Globe
} from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useTheme } from '@/contexts/ThemeContext'

const referralTiers = [
  {
    tier: "Bronze",
    referrals: "1-5",
    commission: "5%",
    bonus: "₦1,000",
    color: "bg-orange-600",
    features: ["Basic dashboard", "Email support", "Monthly payments"]
  },
  {
    tier: "Silver", 
    referrals: "6-15",
    commission: "7%",
    bonus: "₦5,000",
    color: "bg-gray-400",
    features: ["Advanced analytics", "Priority support", "Bi-weekly payments", "Marketing materials"]
  },
  {
    tier: "Gold",
    referrals: "16-30",
    commission: "10%",
    bonus: "₦15,000",
    color: "bg-yellow-500",
    features: ["Premium dashboard", "Dedicated manager", "Weekly payments", "Custom materials", "Training sessions"]
  },
  {
    tier: "Platinum",
    referrals: "31+",
    commission: "15%",
    bonus: "₦50,000",
    color: "bg-purple-600",
    features: ["VIP dashboard", "Personal account manager", "Daily payments", "Co-branding opportunities", "Exclusive events"]
  }
]

const earnings = [
  { type: "Solar Installation", commission: "₦50,000 - ₦200,000", description: "Per completed installation" },
  { type: "Smart Furniture", commission: "₦10,000 - ₦80,000", description: "Per furniture purchase" },
  { type: "EV Charging Station", commission: "₦100,000 - ₦500,000", description: "Per station partnership" },
  { type: "Design Services", commission: "₦25,000 - ₦150,000", description: "Per design project" },
  { type: "Training Programs", commission: "₦5,000 - ₦25,000", description: "Per enrollment" }
]

const successStories = [
  {
    name: "Adebayo Ogundimu",
    location: "Lagos, Nigeria",
    earnings: "₦2,500,000",
    period: "6 months",
    referrals: 45,
    story: "Started as a part-time referrer, now it's my main income source. The solar installations are especially popular in my area."
  },
  {
    name: "Sarah Okafor",
    location: "Abuja, Nigeria", 
    earnings: "₦1,800,000",
    period: "4 months",
    referrals: 32,
    story: "I focus on smart furniture referrals. My interior design background helps me recommend the right products to clients."
  },
  {
    name: "Michael Okwu",
    location: "Port Harcourt, Nigeria",
    earnings: "₦3,200,000",
    period: "8 months",
    referrals: 67,
    story: "EV charging stations are the future. I've helped establish 12 stations in my state and earned great commissions."
  }
]

export default function ReferEarn() {
  const { isDarkMode } = useTheme()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    referralCategory: '',
    experience: '',
    networkSize: '',
    motivation: '',
    marketingChannels: [],
    hasBusinessLicense: false,
    agreedToTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [generatedReferralCode, setGeneratedReferralCode] = useState('')
  const { toast } = useToast()



  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }))
  }

  const generateReferralCode = (fullName: string, email: string): string => {
    // Extract first name and last name initials
    const nameParts = fullName.trim().split(' ').filter(part => part.length > 0)
    const firstName = nameParts[0] || ''
    const lastName = nameParts[nameParts.length - 1] || ''
    
    // Get first 3 letters of first name
    const firstNamePart = firstName.slice(0, 3).toUpperCase()
    
    // Get first 2 letters of last name
    const lastNamePart = lastName.slice(0, 2).toUpperCase()
    
    // Get first 2 letters of email (before @)
    const emailPart = email.split('@')[0].slice(0, 2).toUpperCase()
    
    // Generate random 3-digit number
    const randomNumber = Math.floor(100 + Math.random() * 900)
    
    // Combine all parts
    const referralCode = `ZAV${firstNamePart}${lastNamePart}${emailPart}${randomNumber}`
    
    return referralCode
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    const requiredFields = ['fullName', 'email', 'phone', 'location', 'referralCategory', 'motivation']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    if (!formData.agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Generate referral code
      const referralCode = generateReferralCode(formData.fullName, formData.email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store application data (in real app, this would be sent to backend)
      const applicationData = {
        ...formData,
        referralCode,
        applicationDate: new Date().toISOString(),
        status: 'pending_approval'
      }
      
      // Save to localStorage for demo purposes
      const existingApplications = JSON.parse(localStorage.getItem('referralApplications') || '[]')
      existingApplications.push(applicationData)
      localStorage.setItem('referralApplications', JSON.stringify(existingApplications))
      
      // Store referral code for display
      localStorage.setItem('userReferralCode', referralCode)
      setGeneratedReferralCode(referralCode)
      
      toast({
        title: "Application Submitted!",
        description: `Welcome to the Zavolah Refer & Earn program! Your referral code is: ${referralCode}`,
      })
      
      setStep(4)
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressPercentage = (step / 4) * 100

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}>
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              💰 Earn While You Share
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Refer & Earn
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Big Rewards
              </span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Join Nigeria's most rewarding referral program. Earn up to ₦500,000 per referral 
              by sharing Zavolah's sustainable solutions with your network.
            </p>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold">₦50M+</div>
                <div className="text-sm opacity-80">Paid to Partners</div>
              </div>
              <div>
                <div className="text-3xl font-bold">2,000+</div>
                <div className="text-sm opacity-80">Active Referrers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">15%</div>
                <div className="text-sm opacity-80">Max Commission</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-12">
        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Users className="h-12 w-12" />, title: "Join Program", desc: "Sign up and get your unique referral code" },
              { icon: <Share2 className="h-12 w-12" />, title: "Share & Refer", desc: "Share Zavolah solutions with your network" },
              { icon: <CheckCircle className="h-12 w-12" />, title: "Track Progress", desc: "Monitor your referrals and earnings in real-time" },
              { icon: <DollarSign className="h-12 w-12" />, title: "Get Paid", desc: "Receive commissions for successful conversions" }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Earnings Potential */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Earnings Potential</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {earnings.map((earning, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">{earning.type}</h3>
                  <div className="text-2xl font-bold text-green-600 mb-2">{earning.commission}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{earning.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Referral Tiers */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Referral Tiers & Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {referralTiers.map((tier, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`h-2 ${tier.color}`}></div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {tier.tier}
                    <Trophy className={`h-6 w-6 ${tier.tier === 'Platinum' ? 'text-purple-600' : tier.tier === 'Gold' ? 'text-yellow-500' : tier.tier === 'Silver' ? 'text-gray-400' : 'text-orange-600'}`} />
                  </CardTitle>
                  <CardDescription>{tier.referrals} referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-600">{tier.commission}</div>
                    <div className="text-sm text-gray-600">Commission Rate</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-xl font-semibold">{tier.bonus}</div>
                    <div className="text-sm text-gray-600">Tier Bonus</div>
                  </div>
                  <ul className="space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-16 bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
          <h2 className="text-4xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {story.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold">{story.name}</h3>
                      <p className="text-sm text-gray-600">{story.location}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{story.earnings}</div>
                      <div className="text-xs text-gray-600">Earned</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{story.referrals}</div>
                      <div className="text-xs text-gray-600">Referrals</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{story.period}</div>
                      <div className="text-xs text-gray-600">Period</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{story.story}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Join the Program</CardTitle>
              <CardDescription className="text-lg">
                Start earning today by becoming a Zavolah referral partner
              </CardDescription>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Application Progress</span>
                  <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardHeader>

            <CardContent>
              {step === 4 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-4">Welcome to the Team!</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    Your application has been submitted successfully. Our team will review your application and contact you within 24 hours.
                  </p>
                  
                  {/* Referral Code Display */}
                  {generatedReferralCode && (
                    <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg mb-6">
                      <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200">Your Referral Code</h3>
                      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-green-200">
                        <code className="text-2xl font-bold text-green-600">{generatedReferralCode}</code>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedReferralCode)
                            toast({
                              title: "Copied!",
                              description: "Referral code copied to clipboard"
                            })
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-300 mt-2">
                        Share this code with your referrals to earn commissions!
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">What's Next?</h3>
                    <ul className="text-left space-y-2">
                      <li>• Check your email for a confirmation message</li>
                      <li>• Our team will verify your application</li>
                      <li>• You'll receive your referral materials and dashboard access</li>
                      <li>• Start referring and earning immediately with your code!</li>
                      <li>• Track your earnings and referrals in your dashboard</li>
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <Select onValueChange={(value) => handleInputChange('location', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lagos">Lagos</SelectItem>
                              <SelectItem value="abuja">FCT Abuja</SelectItem>
                              <SelectItem value="kano">Kano</SelectItem>
                              <SelectItem value="rivers">Rivers</SelectItem>
                              <SelectItem value="oyo">Oyo</SelectItem>
                              <SelectItem value="kaduna">Kaduna</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="button" onClick={() => setStep(2)}>
                          Next: Business Info
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold">Business Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="referralCategory">Primary Referral Category *</Label>
                          <Select onValueChange={(value) => handleInputChange('referralCategory', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solar">Solar & Renewable Energy</SelectItem>
                              <SelectItem value="furniture">Smart Furniture</SelectItem>
                              <SelectItem value="construction">Construction Services</SelectItem>
                              <SelectItem value="ev-charging">EV Charging Stations</SelectItem>
                              <SelectItem value="design">Design Services</SelectItem>
                              <SelectItem value="training">Training Programs</SelectItem>
                              <SelectItem value="all">All Categories</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="experience">Business Experience</Label>
                          <Select onValueChange={(value) => handleInputChange('experience', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New to business</SelectItem>
                              <SelectItem value="1-2">1-2 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="5+">5+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="networkSize">Network Size</Label>
                          <Select onValueChange={(value) => handleInputChange('networkSize', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Estimate your network" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small (1-50 contacts)</SelectItem>
                              <SelectItem value="medium">Medium (51-200 contacts)</SelectItem>
                              <SelectItem value="large">Large (201-500 contacts)</SelectItem>
                              <SelectItem value="enterprise">Enterprise (500+ contacts)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>
                            <Checkbox 
                              checked={formData.hasBusinessLicense}
                              onCheckedChange={(checked) => handleInputChange('hasBusinessLicense', checked)}
                              className="mr-2"
                            />
                            I have a business license/registration
                          </Label>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="motivation">Why do you want to join? *</Label>
                        <Textarea
                          id="motivation"
                          value={formData.motivation}
                          onChange={(e) => handleInputChange('motivation', e.target.value)}
                          placeholder="Tell us about your motivation and how you plan to promote Zavolah products..."
                          rows={4}
                          required
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button type="button" onClick={() => setStep(3)}>
                          Next: Marketing
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold">Marketing Preferences</h3>
                      <div>
                        <Label className="text-base font-medium">How will you promote Zavolah? (Select all that apply)</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                          {[
                            { id: 'social-media', label: 'Social Media', icon: <Share2 className="h-4 w-4" /> },
                            { id: 'word-of-mouth', label: 'Word of Mouth', icon: <MessageSquare className="h-4 w-4" /> },
                            { id: 'email', label: 'Email Marketing', icon: <Mail className="h-4 w-4" /> },
                            { id: 'events', label: 'Events & Trade Shows', icon: <Users className="h-4 w-4" /> },
                            { id: 'website', label: 'Personal Website', icon: <Globe className="h-4 w-4" /> },
                            { id: 'mobile', label: 'Mobile/WhatsApp', icon: <Smartphone className="h-4 w-4" /> }
                          ].map((channel) => (
                            <Label key={channel.id} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                              <Checkbox
                                checked={formData.marketingChannels.includes(channel.id)}
                                onCheckedChange={(checked) => handleCheckboxChange('marketingChannels', channel.id, checked as boolean)}
                              />
                              {channel.icon}
                              <span className="text-sm">{channel.label}</span>
                            </Label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>
                          <Checkbox 
                            checked={formData.agreedToTerms}
                            onCheckedChange={(checked) => handleInputChange('agreedToTerms', checked)}
                            className="mr-2"
                          />
                          I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Referral Program Agreement</a>
                        </Label>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">🎉 Ready to Start Earning?</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Once approved, you'll receive your referral code, marketing materials, and access to your earnings dashboard.
                        </p>
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setStep(2)}>
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting || !formData.agreedToTerms}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isSubmitting ? 'Submitting...' : 'Join Program'}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
