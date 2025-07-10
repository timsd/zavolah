import { useState } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from '@/contexts/CartContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useToast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart()
  const { isDarkMode } = useTheme()
  const { toast } = useToast()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('paystack')

  const formatPrice = (priceInKobo: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0 
    }).format(priceInKobo / 100)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checking out.",
        variant: "destructive"
      })
      return
    }
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCheckingOut(true)

    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      
      // Create order record
      const orderData = {
        orderId,
        items: cartItems,
        totalAmount: getTotalPrice(),
        shippingInfo,
        paymentMethod,
        status: 'confirmed',
        timestamp: new Date().toISOString()
      }
      
      // Save to localStorage (in real app, this would be sent to backend)
      const existingOrders = JSON.parse(localStorage.getItem('zavolah-orders') || '[]')
      existingOrders.push(orderData)
      localStorage.setItem('zavolah-orders', JSON.stringify(existingOrders))
      
      toast({
        title: "Order Successful",
        description: `Your order has been placed successfully! Order ID: ${orderId}`,
      })
      
      clearCart()
      setIsPaymentModalOpen(false)
      onClose()
      
      // Reset form
      setShippingInfo({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: ''
      })
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-6 w-6" />
              Shopping Cart ({getTotalItems()} items)
            </DialogTitle>
            <DialogDescription>
              Review your items and proceed to checkout
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-grow overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-600">Your cart is empty</p>
                <p className="text-sm text-gray-500">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      <p className="text-green-600 font-bold">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cartItems.length > 0 && (
            <DialogFooter className="border-t pt-4">
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={clearCart} className="flex-1">
                    Clear Cart
                  </Button>
                  <Button onClick={handleCheckout} className="flex-1 bg-green-600 hover:bg-green-700">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Checkout
                  </Button>
                </div>
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogDescription>
              Provide shipping information and payment details
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-6">
              {/* Shipping Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name" 
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email" 
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number" 
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={shippingInfo.state} onValueChange={(value) => setShippingInfo(prev => ({ ...prev, state: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">Abuja</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                        <SelectItem value="rivers">Rivers</SelectItem>
                        <SelectItem value="ogun">Ogun</SelectItem>
                        <SelectItem value="kaduna">Kaduna</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter your city" 
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Input 
                      id="address" 
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter your full address" 
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paystack" id="paystack" />
                    <Label htmlFor="paystack">Paystack (Cards, Bank Transfer)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flutterwave" id="flutterwave" />
                    <Label htmlFor="flutterwave">Flutterwave (Cards, USSD)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                    <Label htmlFor="bank-transfer">Direct Bank Transfer</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-green-600">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsPaymentModalOpen(false)}
                disabled={isCheckingOut}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Processing..." : "Place Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
