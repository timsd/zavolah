import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShoppingCart, CreditCard, Truck, MapPin, Shield, CheckCircle, ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import Header from '../components/layout/Header'
import { useTheme } from '@/contexts/ThemeContext'
import { useCart } from '@/contexts/CartContext'
import { paymentService } from '@/services/paymentService'
import { Link } from 'react-router-dom'

export default function Checkout() {
  const { isDarkMode } = useTheme()
  const { state: cartState, updateQuantity, removeItem, clearCart } = useCart()
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmation'>('cart')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'delivery'>('card')
  const [deliveryNotes, setDeliveryNotes] = useState('')

  // Shipping calculations
  const shippingCost = cartState.total > 50000 ? 0 : 2500 // Free shipping over ₦50,000
  const tax = Math.round(cartState.total * 0.075) // 7.5% VAT
  const finalTotal = cartState.total + shippingCost + tax

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleShippingSubmit = () => {
    if (Object.values(shippingInfo).every(field => field.trim() !== '')) {
      setStep('payment')
    } else {
      alert('Please fill in all shipping information')
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const paymentPayload = {
        amount: finalTotal * 100, // Convert to kobo
        currency: 'NGN',
        customerEmail: shippingInfo.email,
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerPhone: shippingInfo.phone,
        description: `Zavolah Store Purchase - ${cartState.itemCount} items`,
        orderId: `ORD-${Date.now()}`,
        metadata: {
          items: cartState.items,
          shippingInfo,
          paymentMethod,
          deliveryNotes
        }
      }

      const response = await paymentService.initializePayment(paymentPayload)
      
      if (response.success) {
        // Simulate successful payment
        setTimeout(() => {
          setOrderId(response.reference)
          setStep('confirmation')
          setOrderComplete(true)
          setIsProcessing(false)
          clearCart()
        }, 3000)
      }
    } catch (error) {
      console.error('Payment failed:', error)
      setIsProcessing(false)
      alert('Payment failed. Please try again.')
    }
  }

  const renderCartStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        <p className="text-gray-600">{cartState.itemCount} items</p>
      </div>

      {cartState.items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-4">Add some products to get started</p>
          <Link to="/store">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartState.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.vendor}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="text-lg font-bold text-green-600">₦{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 border rounded-lg p-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({cartState.itemCount} items)</span>
                  <span>₦{cartState.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `₦${shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (7.5%)</span>
                  <span>₦{tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Link to="/store">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Button onClick={() => setStep('shipping')} className="bg-green-600 hover:bg-green-700">
              Proceed to Shipping
            </Button>
          </div>
        </>
      )}
    </div>
  )

  const renderShippingStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Shipping Information</h2>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={shippingInfo.firstName}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={shippingInfo.lastName}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={shippingInfo.email}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+234 803 123 4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Lagos"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={shippingInfo.state}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                placeholder="Lagos State"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={shippingInfo.zipCode}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                placeholder="100001"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deliveryNotes">Delivery Notes (Optional)</Label>
            <Textarea
              id="deliveryNotes"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Special delivery instructions..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('cart')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
        <Button onClick={handleShippingSubmit} className="bg-green-600 hover:bg-green-700">
          Continue to Payment
        </Button>
      </div>
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Method</h2>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label htmlFor="card" className="font-medium">Debit/Credit Card</Label>
                      <p className="text-sm text-gray-600">Pay with Visa, Mastercard, or Verve</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="bank" id="bank" />
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <Label htmlFor="bank" className="font-medium">Bank Transfer</Label>
                      <p className="text-sm text-gray-600">Direct bank transfer</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Truck className="h-5 w-5 text-purple-600" />
                    <div>
                      <Label htmlFor="delivery" className="font-medium">Pay on Delivery</Label>
                      <p className="text-sm text-gray-600">Pay when your order arrives</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Secure Payment</span>
            </div>
            <p className="text-sm text-blue-700">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{cartState.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `₦${shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (7.5%)</span>
                  <span>₦{tax.toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₦{finalTotal.toLocaleString()}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm"><strong>Delivery to:</strong></p>
                <p className="text-sm">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                <p className="text-sm">{shippingInfo.address}, {shippingInfo.city}</p>
                <p className="text-sm">{shippingInfo.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('shipping')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shipping
        </Button>
        <Button 
          onClick={handlePayment} 
          className="bg-green-600 hover:bg-green-700"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ₦${finalTotal.toLocaleString()}`}
        </Button>
      </div>
    </div>
  )

  const renderConfirmationStep = () => (
    <div className="space-y-6 text-center">
      <div className="relative">
        <div className="h-16 w-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-green-800">Order Confirmed!</h2>
        <p className="text-gray-600">Thank you for your purchase</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span className="font-medium">{cartState.itemCount} items</span>
            </div>
            <div className="flex justify-between">
              <span>Total Paid:</span>
              <span className="font-medium">₦{finalTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Method:</span>
              <span className="font-medium">Standard Delivery</span>
            </div>
            <div className="flex justify-between">
              <span>Expected Delivery:</span>
              <span className="font-medium">{new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800 text-sm">
          A confirmation email has been sent to {shippingInfo.email}. 
          You can track your order status in your buyer dashboard.
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <Link to="/buyer-dashboard">
          <Button>View Order Status</Button>
        </Link>
        <Link to="/store">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )

  // Processing modal
  const ProcessingModal = () => (
    <Dialog open={isProcessing} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Processing Payment</DialogTitle>
          <DialogDescription>
            Please wait while we process your payment...
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const getStepContent = () => {
    switch (step) {
      case 'cart':
        return renderCartStep()
      case 'shipping':
        return renderShippingStep()
      case 'payment':
        return renderPaymentStep()
      case 'confirmation':
        return renderConfirmationStep()
      default:
        return renderCartStep()
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          {!orderComplete && (
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {['cart', 'shipping', 'payment'].map((stepName, index) => {
                  const isActive = step === stepName
                  const isCompleted = ['cart', 'shipping', 'payment'].indexOf(step) > index
                  
                  return (
                    <div key={stepName} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-blue-600 text-white' : 
                        isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                      </div>
                      <span className={`ml-2 text-sm ${isActive ? 'font-medium' : 'text-gray-600'}`}>
                        {stepName.charAt(0).toUpperCase() + stepName.slice(1)}
                      </span>
                      {index < 2 && <div className="w-12 h-0.5 bg-gray-300 mx-4" />}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {getStepContent()}
        </div>
      </main>

      <ProcessingModal />
    </div>
  )
}
