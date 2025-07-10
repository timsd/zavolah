import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Smartphone, Building2, CheckCircle, Loader2 } from 'lucide-react'

interface PaymentGatewayProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (amount: number, method: string) => void
}

const topUpAmounts = [
  { value: 500, label: "₦500" },
  { value: 1000, label: "₦1,000" },
  { value: 2000, label: "₦2,000" },
  { value: 5000, label: "₦5,000" },
  { value: 10000, label: "₦10,000" }
]

const paymentMethods = [
  {
    id: 'card',
    name: 'Debit/Credit Card',
    icon: CreditCard,
    description: 'Pay with your Visa, MasterCard, or Verve'
  },
  {
    id: 'transfer',
    name: 'Bank Transfer',
    icon: Building2,
    description: 'Transfer to our account directly'
  },
  {
    id: 'ussd',
    name: 'USSD Code',
    icon: Smartphone,
    description: 'Pay with mobile banking'
  }
]

export default function PaymentGateway({ isOpen, onClose, onSuccess }: PaymentGatewayProps) {
  const [currentStep, setCurrentStep] = useState<'amount' | 'method' | 'details' | 'processing' | 'success'>('amount')
  const [selectedAmount, setSelectedAmount] = useState<number>(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Card details
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(0)
  }

  const getPaymentAmount = () => {
    return customAmount ? parseInt(customAmount) : selectedAmount
  }

  const handlePaymentMethodSelect = () => {
    setCurrentStep('details')
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setCurrentStep('processing')
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setCurrentStep('success')
    setIsProcessing(false)
    
    // Call success callback after 2 seconds
    setTimeout(() => {
      onSuccess?.(getPaymentAmount(), paymentMethod)
      onClose()
      resetForm()
    }, 2000)
  }

  const resetForm = () => {
    setCurrentStep('amount')
    setSelectedAmount(1000)
    setCustomAmount('')
    setPaymentMethod('card')
    setCardDetails({ number: '', expiry: '', cvv: '', name: '' })
    setIsProcessing(false)
  }

  const renderAmountSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Top-Up Amount</h3>
        <div className="grid grid-cols-2 gap-3">
          {topUpAmounts.map((amount) => (
            <Button
              key={amount.value}
              variant={selectedAmount === amount.value ? 'default' : 'outline'}
              onClick={() => handleAmountSelect(amount.value)}
              className="h-12"
            >
              {amount.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or enter custom amount</span>
        </div>
      </div>

      <div>
        <Label htmlFor="custom-amount">Custom Amount</Label>
        <Input
          id="custom-amount"
          type="number"
          placeholder="Enter amount (min ₦100)"
          value={customAmount}
          onChange={(e) => handleCustomAmount(e.target.value)}
          min={100}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Selected Amount: ₦{getPaymentAmount().toLocaleString()}</strong>
        </p>
        <p className="text-xs text-blue-600 mt-1">
          This amount will be added to your ZavCharge account balance
        </p>
      </div>

      <Button 
        onClick={() => setCurrentStep('method')} 
        className="w-full"
        disabled={getPaymentAmount() < 100}
      >
        Continue to Payment Method
      </Button>
    </div>
  )

  const renderPaymentMethod = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <div key={method.id} className="flex items-center space-x-3 border rounded-lg p-4">
                <RadioGroupItem value={method.id} id={method.id} />
                <Icon className="h-6 w-6 text-blue-600" />
                <div className="flex-1">
                  <Label htmlFor={method.id} className="font-medium cursor-pointer">
                    {method.name}
                  </Label>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
            )
          })}
        </RadioGroup>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setCurrentStep('amount')} className="flex-1">
          Back
        </Button>
        <Button onClick={handlePaymentMethodSelect} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  )

  const renderPaymentDetails = () => {
    if (paymentMethod === 'card') {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Card Details</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input
                id="card-name"
                placeholder="Enter name on card"
                value={cardDetails.name}
                onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Amount to Pay: ₦{getPaymentAmount().toLocaleString()}</strong>
            </p>
            <p className="text-xs text-green-600 mt-1">
              Your card will be charged securely via Paystack
            </p>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep('method')} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={handlePayment} 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv}
            >
              Pay ₦{getPaymentAmount().toLocaleString()}
            </Button>
          </div>
        </div>
      )
    }

    if (paymentMethod === 'transfer') {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Bank Transfer Details</h3>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Name:</span>
                  <span className="font-medium">Access Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Name:</span>
                  <span className="font-medium">Zavolah Energy Hub</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium">0123456789</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-green-600">₦{getPaymentAmount().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Important:</strong>
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Use your subscription ID as transfer reference</li>
              <li>• Credits will be added within 10 minutes of payment</li>
              <li>• Save the transaction receipt for your records</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep('method')} className="flex-1">
              Back
            </Button>
            <Button onClick={handlePayment} className="flex-1">
              I've Made the Transfer
            </Button>
          </div>
        </div>
      )
    }

    if (paymentMethod === 'ussd') {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">USSD Payment</h3>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">GTBank</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-lg">*737*50*Amount*Account#</p>
                <p className="text-sm text-gray-600 mt-1">Replace Amount with {getPaymentAmount()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Access Bank</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-lg">*901*Amount*Account#</p>
                <p className="text-sm text-gray-600 mt-1">Replace Amount with {getPaymentAmount()}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep('method')} className="flex-1">
              Back
            </Button>
            <Button onClick={handlePayment} className="flex-1">
              I've Completed Payment
            </Button>
          </div>
        </div>
      )
    }
  }

  const renderProcessing = () => (
    <div className="text-center space-y-6">
      <Loader2 className="h-16 w-16 mx-auto text-blue-600 animate-spin" />
      <div>
        <h3 className="text-lg font-semibold">Processing Payment</h3>
        <p className="text-gray-600">Please wait while we process your payment...</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          Do not close this window or refresh the page
        </p>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
      <div>
        <h3 className="text-lg font-semibold text-green-800">Payment Successful!</h3>
        <p className="text-gray-600">₦{getPaymentAmount().toLocaleString()} has been added to your account</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-800">
          Your new balance will be updated shortly
        </p>
      </div>
    </div>
  )

  const getStepContent = () => {
    switch (currentStep) {
      case 'amount':
        return renderAmountSelection()
      case 'method':
        return renderPaymentMethod()
      case 'details':
        return renderPaymentDetails()
      case 'processing':
        return renderProcessing()
      case 'success':
        return renderSuccess()
      default:
        return renderAmountSelection()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Top Up Credits
          </DialogTitle>
          <DialogDescription>
            Add credits to your ZavCharge account
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {getStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
