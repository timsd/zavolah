import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Bank, Calendar, Zap, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { paymentService } from '@/services/paymentService'

interface ZavChargePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  planType: 'yearly' | 'guest'
  onPaymentSuccess: (data: any) => void
}

export default function ZavChargePaymentModal({ 
  isOpen, 
  onClose, 
  amount, 
  planType,
  onPaymentSuccess 
}: ZavChargePaymentModalProps) {
  const [step, setStep] = useState<'plan' | 'payment' | 'processing' | 'success'>('plan')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'ussd'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentData, setPaymentData] = useState<any>(null)

  const plans = {
    yearly: {
      name: 'Yearly Subscription',
      price: 13000,
      features: [
        'Unlimited charging access',
        'Priority slot booking',
        'Premium locker security',
        '24/7 customer support',
        'Mobile app access',
        'Transaction history',
        'Auto-renewal option'
      ],
      validity: '365 days',
      savings: 'Save ₦7,000 vs monthly payments'
    },
    guest: {
      name: 'Guest Access',
      price: 500,
      features: [
        'Single charging session',
        'Basic locker security',
        'Standard support',
        'Session monitoring',
        'Pay-per-use'
      ],
      validity: 'Single use',
      savings: 'No commitment required'
    }
  }

  const selectedPlan = plans[planType]

  const handlePayment = async () => {
    if (!customerEmail || !customerName || !customerPhone) {
      alert('Please fill in all customer details')
      return
    }

    setIsProcessing(true)
    setStep('processing')

    try {
      const paymentPayload = {
        amount: selectedPlan.price * 100, // Convert to kobo
        currency: 'NGN',
        customerEmail,
        customerName,
        customerPhone,
        description: `ZavCharge ${selectedPlan.name} - ${selectedPlan.validity}`,
        orderId: `ZAV-${Date.now()}`,
        metadata: {
          planType,
          features: selectedPlan.features,
          validity: selectedPlan.validity
        }
      }

      const response = await paymentService.initializePayment(paymentPayload)
      
      if (response.success) {
        setPaymentData(response)
        // Simulate payment redirect (in real implementation, redirect to payment gateway)
        setTimeout(() => {
          setStep('success')
          setIsProcessing(false)
          onPaymentSuccess({
            ...response,
            plan: selectedPlan,
            customer: { customerEmail, customerName, customerPhone }
          })
        }, 3000)
      }
    } catch (error) {
      console.error('Payment failed:', error)
      setIsProcessing(false)
      setStep('payment')
      alert('Payment initialization failed. Please try again.')
    }
  }

  const renderPlanSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Zap className="h-12 w-12 mx-auto mb-4 text-blue-600" />
        <h2 className="text-2xl font-bold">ZavCharge Network Access</h2>
        <p className="text-gray-600">Choose your charging plan</p>
      </div>

      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{selectedPlan.name}</CardTitle>
              <CardDescription>{selectedPlan.validity}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">₦{selectedPlan.price.toLocaleString()}</div>
              {planType === 'yearly' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Best Value
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-green-600 font-medium">{selectedPlan.savings}</p>
            <div className="space-y-2">
              {selectedPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-blue-800">Secure Locker System</span>
        </div>
        <p className="text-sm text-blue-700">
          Your device is safely stored in an encrypted locker during charging. Access with PIN and biometric verification.
        </p>
      </div>

      <Button onClick={() => setStep('payment')} className="w-full h-12 bg-green-600 hover:bg-green-700">
        Continue to Payment
      </Button>
    </div>
  )

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Payment Details</h2>
        <p className="text-gray-600">Secure payment for {selectedPlan.name}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span>Total Amount</span>
          <span className="text-2xl font-bold text-green-600">₦{selectedPlan.price.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="customer-name">Full Name</Label>
          <Input
            id="customer-name"
            placeholder="Enter your full name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="customer-email">Email Address</Label>
          <Input
            id="customer-email"
            type="email"
            placeholder="Enter your email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="customer-phone">Phone Number</Label>
          <Input
            id="customer-phone"
            placeholder="Enter your phone number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-base font-semibold">Payment Method</Label>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-3">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="card" id="card" />
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <Label htmlFor="card" className="font-medium">Debit/Credit Card</Label>
                <p className="text-sm text-gray-600">Visa, Mastercard, Verve accepted</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="bank" id="bank" />
              <Bank className="h-5 w-5 text-green-600" />
              <div>
                <Label htmlFor="bank" className="font-medium">Bank Transfer</Label>
                <p className="text-sm text-gray-600">Direct bank transfer</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="ussd" id="ussd" />
              <Smartphone className="h-5 w-5 text-purple-600" />
              <div>
                <Label htmlFor="ussd" className="font-medium">USSD/Mobile Money</Label>
                <p className="text-sm text-gray-600">Pay via mobile banking</p>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setStep('plan')} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={handlePayment} 
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={!customerEmail || !customerName || !customerPhone}
        >
          Pay ₦{selectedPlan.price.toLocaleString()}
        </Button>
      </div>
    </div>
  )

  const renderProcessing = () => (
    <div className="space-y-6 text-center">
      <div className="relative">
        <div className="h-16 w-16 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <Zap className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" />
      </div>
      <div>
        <h2 className="text-xl font-bold">Processing Payment</h2>
        <p className="text-gray-600">Please wait while we process your payment...</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 justify-center">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-blue-700">Secure payment processing</span>
        </div>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="relative">
        <div className="h-16 w-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-green-800">Payment Successful!</h2>
        <p className="text-gray-600">Your ZavCharge account has been activated</p>
      </div>
      
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-medium">{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-medium">₦{selectedPlan.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Valid Until:</span>
              <span className="font-medium">
                {planType === 'yearly' 
                  ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
                  : 'Single use'
                }
              </span>
            </div>
            {paymentData && (
              <div className="flex justify-between">
                <span>Reference:</span>
                <span className="font-medium">{paymentData.reference}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-blue-800">Next Steps</span>
        </div>
        <p className="text-sm text-blue-700">
          You can now access any ZavCharge station using your registered phone number and PIN.
        </p>
      </div>

      <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
        Start Charging Now
      </Button>
    </div>
  )

  const getStepContent = () => {
    switch (step) {
      case 'plan':
        return renderPlanSelection()
      case 'payment':
        return renderPaymentForm()
      case 'processing':
        return renderProcessing()
      case 'success':
        return renderSuccess()
      default:
        return renderPlanSelection()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            ZavCharge Payment
          </DialogTitle>
          <DialogDescription>
            Secure payment for charging network access
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {getStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
