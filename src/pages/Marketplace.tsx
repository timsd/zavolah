import { useState, useEffect } from 'react'
import { Search, Filter, Grid, List, Star, X, MessageSquare, Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Link } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'

// Mock data for designs
const designs = [
  { 
    id: 1, 
    name: "Modern Minimalist Home", 
    seller: "ArchitectJohn", 
    price: 5000000, // 5 million Naira
    images: ["/placeholder.svg?height=300&width=400&text=Modern+Home", "/placeholder.svg?height=300&width=400&text=Interior"],
    rating: 4.5,
    reviews: 12,
    description: "A sleek, minimalist design perfect for urban living. Features open spaces and large windows for natural light.",
    category: "Residential",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2500,
    featured: true
  },
  { 
    id: 2, 
    name: "Eco-Friendly Treehouse", 
    seller: "GreenDesigns", 
    price: 3500000, // 3.5 million Naira
    images: ["/placeholder.svg?height=300&width=400&text=Treehouse", "/placeholder.svg?height=300&width=400&text=Eco+Design"],
    rating: 4.8,
    reviews: 23,
    description: "Sustainable living meets luxury in this unique treehouse design. Incorporates recycled materials and solar power.",
    category: "Sustainable",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1200,
    featured: true
  },
  { 
    id: 3, 
    name: "Urban Loft Conversion", 
    seller: "CitySpaceInnovators", 
    price: 6000000, // 6 million Naira
    images: ["/placeholder.svg?height=300&width=400&text=Urban+Loft", "/placeholder.svg?height=300&width=400&text=Industrial"],
    rating: 4.2,
    reviews: 8,
    description: "Transform any industrial space into a chic urban loft. High ceilings and exposed brick are key features.",
    category: "Commercial",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 1800,
    featured: false
  },
  { 
    id: 4, 
    name: "Coastal Beach House", 
    seller: "SeaSideArchitects", 
    price: 7500000, // 7.5 million Naira
    images: ["/placeholder.svg?height=300&width=400&text=Beach+House", "/placeholder.svg?height=300&width=400&text=Ocean+View"],
    rating: 4.7,
    reviews: 31,
    description: "Bring the beach to your doorstep with this airy, open-plan design. Large windows and a spacious deck for ocean views.",
    category: "Residential",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3200,
    featured: true
  },
  { 
    id: 5, 
    name: "Mountain Cabin Retreat", 
    seller: "AlpineDesignCo", 
    price: 4500000, // 4.5 million Naira
    images: ["/placeholder.svg?height=300&width=400&text=Mountain+Cabin", "/placeholder.svg?height=300&width=400&text=Rustic"],
    rating: 4.6,
    reviews: 19,
    description: "Cozy mountain getaway with rustic charm. Features a large fireplace and panoramic windows for stunning views.",
    category: "Residential",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1600,
    featured: false
  },
  { 
    id: 6, 
    name: "Smart Home Integration", 
    seller: "TechHouseDesigns", 
    price: 8500000, // 8.5 million Naira
    images: ["/placeholder.svg?height=300&width=400&text=Smart+Home", "/placeholder.svg?height=300&width=400&text=Tech+Interior"],
    rating: 4.9,
    reviews: 42,
    description: "Cutting-edge smart home technology integrated into a modern design. Control everything from your smartphone.",
    category: "Smart Home",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2800,
    featured: true
  },
]

export default function Marketplace() {
  const { isDarkMode } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedDesign, setSelectedDesign] = useState<any>(null)
  const [isConsentFormOpen, setIsConsentFormOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [landSizeUnit, setLandSizeUnit] = useState("sqft")
  const [paymentOption, setPaymentOption] = useState("full")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [paymentMethod, setPaymentMethod] = useState("paystack")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    landSize: "",
    customChanges: "",
    length: "",
    width: ""
  })
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const { toast } = useToast()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0 
    }).format(price)
  }

  const handleDesignSelect = (design: any) => {
    setSelectedDesign(design)
    setIsConsentFormOpen(true)
  }

  const handleConsentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsConsentFormOpen(false)
    setIsPaymentDialogOpen(true)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!clientInfo.name || !clientInfo.email || !selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsProcessingPayment(true)

    try {
      // Calculate payment amount
      const paymentAmount = (selectedDesign?.price || 0) * (paymentOption === 'full' ? 1 : 0.3)
      
      // Simulate payment gateway processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock payment processing for different methods
      const paymentResult = mockPaymentProcessing(paymentMethod, paymentAmount)
      
      if (paymentResult.success) {
        toast({
          title: "Payment Successful",
          description: `Your payment of ${formatPrice(paymentAmount)} has been processed successfully. Order ID: ${paymentResult.orderId}`,
        })
        
        // Create order record
        const orderData = {
          orderId: paymentResult.orderId,
          designId: selectedDesign?.id,
          designName: selectedDesign?.name,
          clientInfo,
          paymentAmount,
          paymentMethod,
          paymentOption,
          selectedDate,
          status: 'confirmed',
          timestamp: new Date().toISOString()
        }
        
        // Save to localStorage (in real app, this would be sent to backend)
        const existingOrders = JSON.parse(localStorage.getItem('marketplaceOrders') || '[]')
        existingOrders.push(orderData)
        localStorage.setItem('marketplaceOrders', JSON.stringify(existingOrders))
        
        setIsPaymentDialogOpen(false)
        setSelectedDesign(null)
        
        // Reset form
        setClientInfo({
          name: "",
          email: "",
          landSize: "",
          customChanges: "",
          length: "",
          width: ""
        })
        setSelectedDate(undefined)
      } else {
        toast({
          title: "Payment Failed",
          description: paymentResult.message || "There was an error processing your payment. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const mockPaymentProcessing = (method: string, amount: number) => {
    // Mock different payment gateway responses
    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    
    // 90% success rate for demo
    const isSuccessful = Math.random() > 0.1
    
    if (isSuccessful) {
      return {
        success: true,
        orderId,
        transactionId: 'TXN-' + Date.now(),
        amount,
        method
      }
    } else {
      return {
        success: false,
        message: "Payment declined. Please check your payment details and try again."
      }
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  const filteredAndSortedDesigns = designs
    .filter(design => {
      const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           design.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           design.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === "all" || design.category.toLowerCase() === filterCategory.toLowerCase()
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "featured":
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }
    })

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}>
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={true}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold mb-2">Design Marketplace</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Discover unique architectural designs from talented creators
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notification */}
            <Button variant="ghost" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                3
              </span>
            </Button>
            
            {/* Messages */}
            <Button variant="ghost" className="relative">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                2
              </span>
            </Button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="sustainable">Sustainable</SelectItem>
                <SelectItem value="smart home">Smart Home</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button 
              variant={viewMode === "grid" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredAndSortedDesigns.length} of {designs.length} designs
          </p>
        </div>

        {/* Designs Grid/List */}
        <div className={`grid gap-6 mb-16 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        }`}>
          {filteredAndSortedDesigns.map((design) => (
            <Card 
              key={design.id} 
              className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                viewMode === "list" ? "flex flex-col lg:flex-row" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${viewMode === "list" ? "lg:w-1/3" : ""}`}>
                <img 
                  src={design.images[0]} 
                  alt={design.name} 
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    viewMode === "list" ? "h-64 lg:h-full" : "h-64"
                  }`}
                />
                {design.featured && (
                  <Badge className="absolute top-3 left-3 bg-orange-500">
                    Featured
                  </Badge>
                )}
                <Badge className="absolute top-3 right-3 bg-blue-500">
                  {design.category}
                </Badge>
              </div>
              
              <div className={`flex flex-col justify-between ${viewMode === "list" ? "lg:w-2/3" : ""}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{design.name}</CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`/placeholder.svg?text=${design.seller[0]}`} />
                          <AvatarFallback>{design.seller[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600 dark:text-gray-400">by {design.seller}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{formatPrice(design.price)}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex">{renderStars(design.rating)}</div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {design.rating} ({design.reviews} reviews)
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {design.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">{design.bedrooms} Bedrooms</Badge>
                    <Badge variant="outline">{design.bathrooms} Bathrooms</Badge>
                    <Badge variant="outline">{design.sqft.toLocaleString()} sq ft</Badge>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button 
                    onClick={() => handleDesignSelect(design)} 
                    className="w-full bg-orange-500 hover:bg-green-600 text-white"
                    size="lg"
                  >
                    Select This Design
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Marketplace Hub</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/marketplace/buyer-dashboard">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>Buyer Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Track your orders, view purchase history, and manage your projects.</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/marketplace/become-seller">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>Become a Seller</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Join our community of designers and start selling your creations.</p>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Design Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get custom design services tailored to your specific needs.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Consent Form Dialog */}
      <Dialog open={isConsentFormOpen} onOpenChange={setIsConsentFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Terms and Consent Agreement</DialogTitle>
            <DialogDescription>
              Please read and agree to the following terms before proceeding with your design purchase.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConsentSubmit}>
            <div className="space-y-4 max-h-60 overflow-y-auto mb-6">
              <div className="text-sm space-y-3">
                <h3 className="font-semibold">Payment Terms:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>You can make an initial 30% payment to engage the designer, or choose to pay 100% upfront.</li>
                  <li>If choosing the 30% option, the remaining 70% will be due upon completion and your approval of the design.</li>
                  <li>All payments are processed securely through our certified payment partners.</li>
                </ul>
                
                <h3 className="font-semibold">Intellectual Property:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Unauthorized use of the designer's work without full payment is strictly prohibited.</li>
                  <li>You will receive full licensing rights upon complete payment.</li>
                  <li>Designs cannot be resold or redistributed without explicit permission.</li>
                </ul>
                
                <h3 className="font-semibold">Legal Terms:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Legal action may be taken for any violation of these terms, resulting in potential fines.</li>
                  <li>All disputes will be resolved through arbitration in Nigeria.</li>
                  <li>By proceeding, you acknowledge that you have read and understood these terms.</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm">
                I have read, understood, and agree to the terms and conditions above
              </Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsConsentFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Agree and Continue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Provide your details and choose your payment option for "{selectedDesign?.name}"
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-6">
              {/* Client Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    value={clientInfo.name}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name" 
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
                    placeholder="Enter your email" 
                    required
                  />
                </div>
              </div>

              {/* Land Size */}
              <div>
                <Label>Land Size</Label>
                <div className="flex space-x-2">
                  <Input 
                    type="number" 
                    placeholder="Enter size" 
                    className="flex-grow"
                    value={clientInfo.landSize}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, landSize: e.target.value }))}
                  />
                  <Select value={landSizeUnit} onValueChange={setLandSizeUnit}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqft">sq ft</SelectItem>
                      <SelectItem value="sqm">sq m</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Custom Dimensions */}
              {landSizeUnit === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="length">Length (ft)</Label>
                    <Input 
                      id="length" 
                      type="number" 
                      placeholder="Length"
                      value={clientInfo.length}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, length: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="width">Width (ft)</Label>
                    <Input 
                      id="width" 
                      type="number" 
                      placeholder="Width"
                      value={clientInfo.width}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, width: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {/* Custom Changes */}
              <div>
                <Label htmlFor="custom-changes">Custom Changes or Special Requirements</Label>
                <Textarea 
                  id="custom-changes" 
                  placeholder="Describe any modifications you'd like to make to this design..."
                  rows={4}
                  value={clientInfo.customChanges}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, customChanges: e.target.value }))}
                />
              </div>

              {/* Project Start Date */}
              <div>
                <Label>Preferred Project Start Date *</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mt-2"
                  disabled={(date) => date < new Date()}
                />
              </div>

              {/* Payment Options */}
              <div>
                <Label>Payment Option</Label>
                <RadioGroup value={paymentOption} onValueChange={setPaymentOption} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full-payment" />
                    <Label htmlFor="full-payment">
                      100% Upfront Payment ({formatPrice(selectedDesign?.price || 0)})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="installment" id="installment-payment" />
                    <Label htmlFor="installment-payment">
                      30% Initial Payment ({formatPrice((selectedDesign?.price || 0) * 0.3)})
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Method */}
              <div>
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paystack">Paystack (Cards, Bank Transfer)</SelectItem>
                    <SelectItem value="flutterwave">Flutterwave (Cards, USSD)</SelectItem>
                    <SelectItem value="bank-transfer">Direct Bank Transfer</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Design: {selectedDesign?.name}</span>
                    <span>{formatPrice(selectedDesign?.price || 0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Amount Due Today:</span>
                    <span className="text-green-600">
                      {formatPrice((selectedDesign?.price || 0) * (paymentOption === 'full' ? 1 : 0.3))}
                    </span>
                  </div>
                  {paymentOption === 'installment' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Remaining (due on completion):</span>
                      <span>{formatPrice((selectedDesign?.price || 0) * 0.7)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsPaymentDialogOpen(false)}
                disabled={isProcessingPayment}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? "Processing..." : "Proceed to Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
