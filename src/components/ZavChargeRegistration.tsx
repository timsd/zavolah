import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { User, Mail, Phone, CreditCard, Zap, Clock } from 'lucide-react'

interface ZavChargeRegistrationProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: any) => void
}

export default function ZavChargeRegistration({ isOpen, onClose, onSuccess }: ZavChargeRegistrationProps) {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Plan Selection
    planType: 'yearly', // 'yearly' or 'guest'
    
    // Payment Information
    paymentMethod: 'paystack',
    
    // Terms
    agreedToTerms: false
  })

  const plans = {
    yearly: {
      name: 'Annual Subscription',
      price: 13000,
      duration: '12 months',
      benefits: [
        'Unlimited charging sessions',
        'Priority station access',
        'Mobile app access',
        '24/7 customer support',
        'Real-time availability tracking',
        'Exclusive member discounts'
      ]
    },
    guest: {
      name: 'Guest Access',
      price: 500,
      duration: 'Per session',
      benefits: [
        'One-time charging access',
        'Basic station access',
        'Limited support',
        'Pay-per-use model'
      ]
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step === 1) {
      // Validate personal information
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        })
        return
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive"
        })
        return
      }
      
      // Validate phone format (Nigerian numbers)
      const phoneRegex = /^(\+234|0)[789]\d{9}$/
      if (!phoneRegex.test(formData.phone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid Nigerian phone number.",
          variant: "destructive"
        })
        return
      }
    }
    
    if (step === 2) {
      // Validate terms agreement
      if (!formData.agreedToTerms) {
        toast({
          title: "Terms Required",
          description: "Please agree to the terms and conditions to continue.",
          variant: "destructive"
        })
        return
      }
    }
    
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    setIsProcessing(true)
    
    try {
      // Generate disposable ID for guest users
      const disposableId = formData.planType === 'guest' 
        ? 'GUEST-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
        : null
      
      // Generate user ID for subscription users
      const userId = formData.planType === 'yearly'
        ? 'USER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
        : null
      
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create registration record
      const registrationData = {
        userId: userId || disposableId,
        disposableId,
        planType: formData.planType,
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        subscription: {
          plan: plans[formData.planType],
          amount: plans[formData.planType].price,
          startDate: new Date().toISOString(),
          expiryDate: formData.planType === 'yearly' 
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : null,
          status: 'active'
        },
        paymentMethod: formData.paymentMethod,
        registrationDate: new Date().toISOString()
      }
      
      // Save to localStorage (in real app, this would be sent to backend)
      const existingRegistrations = JSON.parse(localStorage.getItem('zavcharge-registrations') || '[]')
      existingRegistrations.push(registrationData)
      localStorage.setItem('zavcharge-registrations', JSON.stringify(existingRegistrations))
      
      // For guest users, save disposable ID for session
      if (formData.planType === 'guest') {
        sessionStorage.setItem('zavcharge-guest-id', disposableId!)
        sessionStorage.setItem('zavcharge-guest-expiry', (Date.now() + 24 * 60 * 60 * 1000).toString()) // 24 hours
      }
      
      toast({
        title: "Registration Successful",
        description: `Welcome to ZavCharge! Your ${formData.planType === 'yearly' ? 'subscription' : 'guest access'} is now active.`,
      })
      
      onSuccess(registrationData)
      onClose()
      
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0 
    }).format(price)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Zap className="mr-2 h-6 w-6 text-green-600" />
            Register for ZavCharge Network
          </DialogTitle>
          <DialogDescription>
            Join Nigeria's first solar-powered charging network
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
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
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+234 xxx xxx xxxx"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Plan Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Choose Your Plan
              </h3>
              
              <RadioGroup 
                value={formData.planType} 
                onValueChange={(value) => handleInputChange('planType', value)}
              >
                {Object.entries(plans).map(([key, plan]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={key} id={key} />
                      <div className="flex-grow">
                        <Label htmlFor={key} className="text-lg font-semibold cursor-pointer">
                          {plan.name}
                        </Label>
                        <p className="text-2xl font-bold text-green-600">{formatPrice(plan.price)}</p>
                        <p className="text-sm text-gray-600">{plan.duration}</p>
                        
                        <ul className="mt-3 space-y-1">
                          {plan.benefits.map((benefit, index) => (
                            <li key={index} className="text-sm flex items-center">
                              <Zap className="h-3 w-3 mr-2 text-green-600" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              
              {/* Payment Method */}
              <div>
                <Label>Payment Method</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paystack">Paystack (Cards, Bank Transfer)</SelectItem>
                    <SelectItem value="flutterwave">Flutterwave (Cards, USSD)</SelectItem>
                    <SelectItem value="bank-transfer">Direct Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Terms and Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Complete Registration
              </h3>
              
              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Registration Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span>{plans[formData.planType].name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{plans[formData.planType].duration}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">{formatPrice(plans[formData.planType].price)}</span>
                  </div>
                </div>
              </div>
              
              {/* Terms and Conditions */}
              <div className="border rounded-lg p-4 max-h-40 overflow-y-auto">
                <h4 className="font-semibold mb-2">Terms and Conditions</h4>
                <div className="text-sm space-y-2">
                  <p>By registering for ZavCharge Network, you agree to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use charging stations responsibly and follow safety guidelines</li>
                    <li>Pay for services according to your selected plan</li>
                    <li>Report any issues or damages to customer support</li>
                    <li>Allow ZavCharge to process your payment information securely</li>
                    <li>Receive communications related to your account and service updates</li>
                    {formData.planType === 'guest' && (
                      <li>Understand that guest access expires after 24 hours and requires new registration for subsequent use</li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreedToTerms', !!checked)}
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  I have read and agree to the terms and conditions
                </Label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={step === 1 ? onClose : () => setStep(step - 1)}
              disabled={isProcessing}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            {step < 3 ? (
              <Button onClick={handleNext} disabled={isProcessing}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isProcessing || !formData.agreedToTerms}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? 'Processing...' : `Complete Registration (${formatPrice(plans[formData.planType].price)})`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
