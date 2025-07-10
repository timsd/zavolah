import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Upload, DollarSign, Users, TrendingUp, Award, Star } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useTheme } from '@/contexts/ThemeContext'

const benefits = [
  {
    icon: <DollarSign className="h-8 w-8 text-green-600" />,
    title: "Earn Revenue",
    description: "Set your own prices and earn from every design sold"
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Global Audience",
    description: "Reach customers across Nigeria and beyond"
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
    title: "Grow Your Brand",
    description: "Build your reputation and expand your portfolio"
  },
  {
    icon: <Award className="h-8 w-8 text-purple-600" />,
    title: "Professional Support",
    description: "Get marketing and technical support from our team"
  }
]

const sellerStats = [
  { label: "Active Sellers", value: "500+", change: "+15% this month" },
  { label: "Average Monthly Earnings", value: "₦850K", change: "+23% vs last year" },
  { label: "Total Designs Sold", value: "12,000+", change: "+45% this quarter" },
  { label: "Customer Satisfaction", value: "4.8/5", change: "Highest rated platform" }
]

const testimonials = [
  {
    name: "Adebayo Ogundimu",
    role: "Architect",
    avatar: "/placeholder.svg?height=60&width=60&text=AO",
    rating: 5,
    text: "Joining Zavolah as a seller was the best decision for my architecture practice. I've sold over 200 designs and built a strong client base."
  },
  {
    name: "Sarah Okafor",
    role: "Interior Designer",
    avatar: "/placeholder.svg?height=60&width=60&text=SO",
    rating: 5,
    text: "The platform makes it so easy to showcase my work and connect with clients. The support team is incredibly helpful."
  },
  {
    name: "Michael Okwu",
    role: "Structural Engineer",
    avatar: "/placeholder.svg?height=60&width=60&text=MO",
    rating: 5,
    text: "I love the collaborative environment and the quality of projects. It's helped me grow my business significantly."
  }
]

const steps = [
  {
    step: 1,
    title: "Apply",
    description: "Submit your application with portfolio samples"
  },
  {
    step: 2,
    title: "Review",
    description: "Our team reviews your qualifications (2-3 business days)"
  },
  {
    step: 3,
    title: "Setup",
    description: "Complete your profile and upload your first designs"
  },
  {
    step: 4,
    title: "Sell",
    description: "Start earning from your architectural designs"
  }
]

export default function BecomeSeller() {
  const { isDarkMode } = useTheme()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    sellerUsername: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    bio: '',
    experience: '',
    specialization: '',
    portfolio: null,
    certifications: null,
    agreesToTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()



  const handleInputChange = (e: any) => {
    const { name, value, type, checked, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files?.[0] : value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    const requiredFields = ['fullName', 'email', 'phone', 'businessName', 'sellerUsername', 'bio', 'experience', 'specialization']
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

    if (!formData.agreesToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Application Submitted Successfully!",
        description: "We'll review your application and get back to you within 2-3 business days.",
      })
      
      // Reset form or redirect
      setCurrentStep(4)
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}>
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Become a Zavolah Seller</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join our community of talented designers and architects. Showcase your work, reach new clients, and grow your business.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                Start Application
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Benefits Section */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12">Why Sell on Zavolah?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className="mb-16 bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Platform Statistics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sellerStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{stat.value}</div>
                  <div className="text-lg font-medium mb-1">{stat.label}</div>
                  <div className="text-sm text-green-600">{stat.change}</div>
                </div>
              ))}
            </div>
          </section>

          {/* How it Works */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12">How to Get Started</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12">What Our Sellers Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">{renderStars(testimonial.rating)}</div>
                    <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Application Form */}
          <section className="mb-16">
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Seller Application</CardTitle>
                <CardDescription className="text-lg">
                  Fill out the form below to join our marketplace as a verified seller
                </CardDescription>
                
                {/* Progress Indicator */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Application Progress</span>
                    <span className="text-sm font-medium">{Math.round((currentStep / 4) * 100)}%</span>
                  </div>
                  <Progress value={(currentStep / 4) * 100} className="h-2" />
                </div>
              </CardHeader>

              <CardContent>
                <Tabs value={`step-${currentStep}`} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="step-1" disabled={currentStep < 1}>Personal Info</TabsTrigger>
                    <TabsTrigger value="step-2" disabled={currentStep < 2}>Business Details</TabsTrigger>
                    <TabsTrigger value="step-3" disabled={currentStep < 3}>Portfolio</TabsTrigger>
                    <TabsTrigger value="step-4" disabled={currentStep < 4}>Review</TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Personal Information */}
                    <TabsContent value="step-1" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
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
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="sellerUsername">Seller Username *</Label>
                          <Input
                            id="sellerUsername"
                            name="sellerUsername"
                            value={formData.sellerUsername}
                            onChange={handleInputChange}
                            placeholder="Choose a unique username"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="button" onClick={() => setCurrentStep(2)}>
                          Next: Business Details
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Step 2: Business Details */}
                    <TabsContent value="step-2" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="businessName">Business/Studio Name *</Label>
                          <Input
                            id="businessName"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="Enter your business name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="specialization">Specialization *</Label>
                          <Select onValueChange={(value) => handleSelectChange('specialization', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residential">Residential Architecture</SelectItem>
                              <SelectItem value="commercial">Commercial Architecture</SelectItem>
                              <SelectItem value="interior">Interior Design</SelectItem>
                              <SelectItem value="landscape">Landscape Architecture</SelectItem>
                              <SelectItem value="structural">Structural Engineering</SelectItem>
                              <SelectItem value="sustainable">Sustainable Design</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="experience">Years of Experience *</Label>
                          <Select onValueChange={(value) => handleSelectChange('experience', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-2">1-2 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="6-10">6-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">Professional Bio *</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about your background, expertise, and design philosophy..."
                          rows={4}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            placeholder="Enter bank name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                            placeholder="Enter account number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountName">Account Name</Label>
                          <Input
                            id="accountName"
                            name="accountName"
                            value={formData.accountName}
                            onChange={handleInputChange}
                            placeholder="Enter account name"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                          Back
                        </Button>
                        <Button type="button" onClick={() => setCurrentStep(3)}>
                          Next: Portfolio
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Step 3: Portfolio */}
                    <TabsContent value="step-3" className="space-y-6">
                      <div>
                        <Label htmlFor="portfolio">Portfolio (PDF/ZIP) *</Label>
                        <Input
                          id="portfolio"
                          name="portfolio"
                          type="file"
                          accept=".pdf,.zip,.rar"
                          onChange={handleInputChange}
                          className="cursor-pointer"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Upload your portfolio showcasing your best work (Max 50MB)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="certifications">Certifications (Optional)</Label>
                        <Input
                          id="certifications"
                          name="certifications"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleInputChange}
                          className="cursor-pointer"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Upload relevant certifications or licenses
                        </p>
                      </div>

                      <Card className="bg-blue-50 dark:bg-gray-800">
                        <CardContent className="pt-6">
                          <h4 className="font-semibold mb-2">Portfolio Guidelines</h4>
                          <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                            <li>• Include 5-10 of your best completed projects</li>
                            <li>• Show variety in project types and scales</li>
                            <li>• Include both 2D plans and 3D renderings where possible</li>
                            <li>• Add brief descriptions for each project</li>
                            <li>• Ensure all images are high resolution</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                          Back
                        </Button>
                        <Button type="button" onClick={() => setCurrentStep(4)}>
                          Review Application
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Step 4: Review and Submit */}
                    <TabsContent value="step-4" className="space-y-6">
                      <div className="text-center mb-6">
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold">Ready to Submit</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Please review your information before submitting your application
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Personal Information</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm space-y-2">
                            <p><strong>Name:</strong> {formData.fullName}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>Phone:</strong> {formData.phone}</p>
                            <p><strong>Username:</strong> {formData.sellerUsername}</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Business Details</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm space-y-2">
                            <p><strong>Business:</strong> {formData.businessName}</p>
                            <p><strong>Specialization:</strong> {formData.specialization}</p>
                            <p><strong>Experience:</strong> {formData.experience}</p>
                            <p><strong>Portfolio:</strong> {formData.portfolio?.name || 'Not uploaded'}</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="terms" 
                          checked={formData.agreesToTerms}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, agreesToTerms: checked as boolean }))
                          }
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the <a href="#" className="text-orange-600 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-600 hover:underline">Seller Agreement</a>
                        </Label>
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setCurrentStep(3)}>
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting || !formData.agreesToTerms}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </div>
                    </TabsContent>
                  </form>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
