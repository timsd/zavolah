import { useState } from 'react'
import { Zap, Sofa, HardHat, MessageCircle, ChevronDown, ChevronUp, Calendar, Clock, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useTheme } from '@/contexts/ThemeContext'

const services = [
  {
    title: "Renewable Energy Solutions",
    icon: <Zap className="h-12 w-12 text-orange-500" />,
    description: "We offer comprehensive renewable energy solutions including solar panel installation, inverter design, and minigrid systems.",
    details: [
      "Solar panel installation and maintenance",
      "Custom inverter design and setup", 
      "Minigrid design and implementation",
      "Energy efficiency consultations",
      "Battery storage solutions",
      "Grid-tie and off-grid systems"
    ],
    image: "/placeholder.svg?text=Renewable+Energy&width=400&height=300",
    testimonial: {
      text: "Zavolah's renewable energy solutions have significantly reduced our energy costs and carbon footprint. The installation was professional and the system has been running flawlessly for over a year.",
      author: "John Doe, CEO of GreenTech Inc.",
      rating: 5
    },
    faqs: [
      { 
        question: "How long does a typical solar panel installation take?",
        answer: "A typical residential solar panel installation takes 1-3 days, depending on the system size and complexity. Commercial installations may take 1-2 weeks."
      },
      {
        question: "What maintenance do solar panels require?",
        answer: "Solar panels generally require minimal maintenance. Annual cleaning and inspection are recommended to ensure optimal performance. We offer maintenance packages for ongoing support."
      },
      {
        question: "Do you provide financing options?",
        answer: "Yes, we offer various financing options including solar loans, leasing, and power purchase agreements (PPAs) to make renewable energy accessible to everyone."
      }
    ],
    pricing: "Starting from ₦500,000",
    duration: "1-7 days"
  },
  {
    title: "Smart Furniture",
    icon: <Sofa className="h-12 w-12 text-green-600" />,
    description: "Our smart furniture solutions combine style, functionality, and technology to maximize space and enhance comfort.",
    details: [
      "Space-saving furniture designs",
      "Smart home integration",
      "Customizable modular furniture",
      "Ergonomic office solutions",
      "Tech-enabled furniture for institutions",
      "IoT connectivity and app control"
    ],
    image: "/placeholder.svg?text=Smart+Furniture&width=400&height=300",
    testimonial: {
      text: "Zavolah's smart furniture has transformed our office space, improving both aesthetics and productivity. The modular design allowed us to maximize our limited space efficiently.",
      author: "Jane Smith, Director of Operations at TechCorp",
      rating: 5
    },
    faqs: [
      {
        question: "Can smart furniture be integrated with existing smart home systems?",
        answer: "Yes, our smart furniture is designed to be compatible with popular smart home ecosystems like Google Home, Amazon Alexa, and Apple HomeKit."
      },
      {
        question: "What kind of warranty do you offer on smart furniture?",
        answer: "We offer a 2-year warranty on all electronic components and a 5-year warranty on furniture construction and mechanisms."
      },
      {
        question: "Do you offer custom designs?",
        answer: "Absolutely! We specialize in custom furniture solutions tailored to your specific space requirements and aesthetic preferences."
      }
    ],
    pricing: "Starting from ₦200,000",
    duration: "2-4 weeks"
  },
  {
    title: "Construction Services",
    icon: <HardHat className="h-12 w-12 text-orange-500" />,
    description: "From pre-construction planning to post-construction maintenance, we offer end-to-end construction services.",
    details: [
      "Site clearing and preparation",
      "Architectural design and consultation",
      "Green building practices",
      "Construction project management",
      "Renovation and repair services",
      "Quality assurance and safety compliance"
    ],
    image: "/placeholder.svg?text=Construction&width=400&height=300",
    testimonial: {
      text: "Zavolah's construction team delivered our project on time and within budget. Their attention to detail and commitment to quality was impressive throughout the entire process.",
      author: "Robert Johnson, Property Developer",
      rating: 5
    },
    faqs: [
      {
        question: "Do you handle all necessary permits for construction projects?",
        answer: "Yes, we manage all required permits and ensure compliance with local building codes and regulations. Our team handles the entire approval process."
      },
      {
        question: "What sustainable practices do you implement?",
        answer: "We prioritize energy-efficient designs, use sustainable materials when possible, implement waste reduction strategies, and incorporate renewable energy systems where applicable."
      },
      {
        question: "Do you provide project management services?",
        answer: "Yes, we offer comprehensive project management including timeline coordination, quality control, budget management, and regular progress reporting."
      }
    ],
    pricing: "Custom quotes available",
    duration: "4-24 weeks"
  },
  {
    title: "Consultation Services",
    icon: <MessageCircle className="h-12 w-12 text-green-600" />,
    description: "Our expert consultants are ready to guide you through your project, offering tailored advice and solutions.",
    details: [
      "Virtual and in-person consultations",
      "On-site assessments and surveys",
      "Project planning and feasibility studies",
      "Sustainability audits",
      "Technology integration consultations",
      "Ongoing support and monitoring"
    ],
    image: "/placeholder.svg?text=Consultation&width=400&height=300",
    testimonial: {
      text: "The insights from Zavolah's consultation services were invaluable in shaping our sustainability strategy. Their expertise helped us make informed decisions that saved us both time and money.",
      author: "Emily Chen, Sustainability Manager at EcoFriendly Co.",
      rating: 5
    },
    faqs: [
      {
        question: "How long does a typical consultation process take?",
        answer: "Initial consultations usually take 1-2 hours, while comprehensive assessments may span several days to weeks depending on project scope."
      },
      {
        question: "Can you provide ongoing support after the initial consultation?",
        answer: "We offer various support packages to ensure successful implementation and monitoring of our recommendations, including regular check-ins and progress reviews."
      },
      {
        question: "Do you offer emergency consultation services?",
        answer: "Yes, we provide emergency consultation services for urgent situations. Contact us directly for immediate assistance."
      }
    ],
    pricing: "₦50,000 - ₦500,000",
    duration: "1 hour - 4 weeks"
  }
]

export default function Services() {
  const { isDarkMode } = useTheme()
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [expandedFAQs, setExpandedFAQs] = useState<{ [key: string]: number | null }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    if (!selectedService || !selectedDate || !selectedTime || !clientInfo.name || !clientInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Consultation Booked Successfully!",
        description: "We'll send you a confirmation email shortly with meeting details.",
      })
      
      setIsDialogOpen(false)
      
      // Reset form
      setSelectedService("")
      setSelectedDate("")
      setSelectedTime("")
      setClientInfo({
        name: "",
        email: "",
        phone: "",
        message: ""
      })
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your consultation. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFAQ = (serviceTitle: string, faqIndex: number) => {
    setExpandedFAQs(prev => ({
      ...prev,
      [serviceTitle]: prev[serviceTitle] === faqIndex ? null : faqIndex
    }))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ))
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}>
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold mb-4">Our Services</h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Comprehensive solutions for renewable energy, smart furniture, construction, and expert consultation services
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Free Consultation
                  </Button>
                </DialogTrigger>
              </Dialog>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Services Grid */}
          <section className="grid lg:grid-cols-2 gap-12 mb-20">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                {/* Service Header */}
                <div className="flex items-center mb-6">
                  <div className="mr-4">{service.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <Badge variant="outline">{service.pricing}</Badge>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {service.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 text-lg`}>
                  {service.description}
                </p>

                {/* Service Image */}
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Service Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">What's Included:</h3>
                  <ul className="grid grid-cols-1 gap-2">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Testimonial */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex mb-2">{renderStars(service.testimonial.rating)}</div>
                  <blockquote className="italic text-sm mb-2">
                    "{service.testimonial.text}"
                  </blockquote>
                  <footer className="text-sm font-medium">
                    — {service.testimonial.author}
                  </footer>
                </div>

                {/* FAQs */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
                  {service.faqs.map((faq, idx) => (
                    <div key={idx} className="border rounded-lg mb-2">
                      <button
                        className="flex justify-between items-center w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => toggleFAQ(service.title, idx)}
                      >
                        <span className="font-medium text-sm">{faq.question}</span>
                        {expandedFAQs[service.title] === idx ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </button>
                      <AnimatePresence>
                        {expandedFAQs[service.title] === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="p-3 pt-0 text-sm text-gray-600 dark:text-gray-300">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className="w-full bg-orange-500 hover:bg-green-600 text-white"
                  onClick={() => {
                    setSelectedService(service.title)
                    setIsDialogOpen(true)
                  }}
                >
                  Get Started with {service.title}
                </Button>
              </motion.div>
            ))}
          </section>

          {/* Why Choose Us Section */}
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Why Choose Zavolah?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We're committed to delivering exceptional service and innovative solutions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🏆",
                  title: "Expert Team",
                  description: "Certified professionals with years of industry experience"
                },
                {
                  icon: "⚡",
                  title: "Fast Delivery",
                  description: "Efficient project completion without compromising quality"
                },
                {
                  icon: "💡",
                  title: "Innovation",
                  description: "Cutting-edge solutions using the latest technology"
                },
                {
                  icon: "🛡️",
                  title: "Quality Guarantee",
                  description: "Comprehensive warranties and ongoing support"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-2xl p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                Let's discuss your project and find the perfect solution for your needs
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Schedule Consultation
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900"
                >
                  Call: +234 806 640 4608
                </Button>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Consultation Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule a Consultation</DialogTitle>
            <DialogDescription>
              Book a consultation with a Zavolah advisor to discuss your project needs. We'll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleBookConsultation}>
            <div className="grid gap-6 py-4">
              {/* Service Selection */}
              <div>
                <Label htmlFor="service">Service of Interest *</Label>
                <Select onValueChange={setSelectedService} value={selectedService} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.title} value={service.title}>
                        {service.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={clientInfo.name}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time *</Label>
                  <Select onValueChange={setSelectedTime} value={selectedTime} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message">Project Details</Label>
                <Textarea
                  id="message"
                  value={clientInfo.message}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your project, budget range, timeline, and any specific requirements..."
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Booking...' : 'Book Consultation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
