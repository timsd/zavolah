import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Zap, Unlock, Lock, CreditCard, Clock, CheckCircle, AlertCircle, User, KeyRound, Smartphone, Shield, Camera, Fingerprint, Battery, Monitor, Power, BatteryCharging } from 'lucide-react'
import ZavChargePaymentModal from './ZavChargePaymentModal'

interface ChargingStation {
  id: number
  name: string
  location: string
  slots: Array<{
    id: string
    status: string
    connector: string
  }>
}

interface ChargingStationDashboardProps {
  station?: ChargingStation
  isOpen: boolean
  onClose: () => void
}

export default function ChargingStationDashboard({ station, isOpen, onClose }: ChargingStationDashboardProps) {
  const [currentStep, setCurrentStep] = useState<'login' | 'dashboard' | 'charging' | 'payment' | 'locker'>('login')
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loginType, setLoginType] = useState<'subscription' | 'guest'>('subscription')
  const [subscriptionId, setSubscriptionId] = useState('')
  const [pin, setPin] = useState('')
  const [chargingProgress, setChargingProgress] = useState(0)
  const [batteryLevel, setBatteryLevel] = useState(25)
  const [isCharging, setIsCharging] = useState(false)
  const [isLockerOpen, setIsLockerOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [guestId, setGuestId] = useState('')
  const [chargingTime, setChargingTime] = useState(0)
  const [deviceConnected, setDeviceConnected] = useState(false)

  // Mock subscription data
  const mockSubscription = {
    id: 'SUB-2024-001',
    balance: 2450.00,
    plan: 'Premium',
    status: 'Active'
  }

  const handleLogin = () => {
    if (loginType === 'subscription' && subscriptionId && pin) {
      setCurrentStep('dashboard')
    } else if (loginType === 'guest') {
      // Generate guest ID for secure access
      const generatedGuestId = `GUEST-${Date.now().toString().slice(-6)}`
      setGuestId(generatedGuestId)
      setIsPaymentModalOpen(true)
    }
  }

  const handleSlotSelection = (slotId: string) => {
    setSelectedSlot(slotId)
  }

  const handleUnlockSlot = () => {
    if (selectedSlot) {
      setCurrentStep('locker')
      setIsLockerOpen(true)
    }
  }

  const handleDeviceConnect = () => {
    setDeviceConnected(true)
    setCurrentStep('charging')
    setIsCharging(true)
    setChargingTime(0)
    
    // Simulate charging progress and battery level
    const interval = setInterval(() => {
      setChargingProgress(prev => {
        const newProgress = Math.min(prev + 1.5, 100)
        setBatteryLevel(Math.min(25 + (newProgress * 0.75), 100))
        setChargingTime(prev => prev + 1)
        
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsCharging(false)
          return 100
        }
        return newProgress
      })
    }, 1000)
  }

  const handleLockSlot = () => {
    setIsLockerOpen(false)
    setCurrentStep('dashboard')
  }

  const handleStopCharging = () => {
    setIsCharging(false)
    setCurrentStep('dashboard')
    setChargingProgress(0)
    setBatteryLevel(25)
    setChargingTime(0)
    setDeviceConnected(false)
  }

  const handlePaymentSuccess = (data: any) => {
    setIsPaymentModalOpen(false)
    setCurrentStep('dashboard')
  }

  const renderLogin = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Zap className="h-16 w-16 mx-auto mb-4 text-blue-600" />
        <h2 className="text-2xl font-bold">ZavCharge Station Access</h2>
        <p className="text-gray-600">{station?.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={loginType === 'subscription' ? 'default' : 'outline'}
          onClick={() => setLoginType('subscription')}
          className="h-20 flex-col"
        >
          <User className="h-6 w-6 mb-2" />
          Subscription Login
        </Button>
        <Button
          variant={loginType === 'guest' ? 'default' : 'outline'}
          onClick={() => setLoginType('guest')}
          className="h-20 flex-col"
        >
          <CreditCard className="h-6 w-6 mb-2" />
          Guest Payment
        </Button>
      </div>

      {loginType === 'subscription' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="subscription-id">Subscription ID</Label>
            <Input
              id="subscription-id"
              placeholder="Enter your subscription ID"
              value={subscriptionId}
              onChange={(e) => setSubscriptionId(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="pin">PIN</Label>
            <Input
              id="pin"
              type="password"
              placeholder="Enter your 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
            />
          </div>
        </div>
      )}

      <Button 
        onClick={handleLogin} 
        className="w-full h-12"
        disabled={loginType === 'subscription' && (!subscriptionId || !pin)}
      >
        {loginType === 'subscription' ? (
          <>
            <KeyRound className="mr-2 h-4 w-4" />
            Login to Account
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Continue as Guest
          </>
        )}
      </Button>
    </div>
  )

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Welcome Back!</h2>
          <p className="text-sm text-gray-600">Subscription: {mockSubscription.id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Account Balance</p>
          <p className="text-2xl font-bold text-green-600">₦{mockSubscription.balance.toFixed(2)}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Charging Slot</CardTitle>
          <CardDescription>Choose an available slot to start charging</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {station?.slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => slot.status === 'available' && handleSlotSelection(slot.id)}
                disabled={slot.status === 'occupied'}
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all ${
                  selectedSlot === slot.id
                    ? 'bg-blue-500 ring-2 ring-blue-300'
                    : slot.status === 'available' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 cursor-not-allowed'
                }`}
                title={`Slot ${slot.id}: ${slot.status} (${slot.connector})`}
              >
                {slot.status === 'available' ? '✓' : '●'}
              </button>
            ))}
          </div>

          {selectedSlot && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Selected Slot: {selectedSlot}</span>
                <Badge variant="outline">
                  {station?.slots.find(s => s.id === selectedSlot)?.connector}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Estimated cost: ₦50/kWh • This slot will be unlocked for your use
              </p>
              <Button onClick={handleUnlockSlot} className="w-full bg-green-600 hover:bg-green-700">
                <Unlock className="mr-2 h-4 w-4" />
                Unlock Slot {selectedSlot}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={() => setCurrentStep('login')}>
          Logout
        </Button>
        <Button variant="outline">
          <Smartphone className="mr-2 h-4 w-4" />
          Mobile App
        </Button>
      </div>
    </div>
  )

  const renderCharging = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <Smartphone className="h-12 w-12 text-gray-400" />
              <Battery className={`absolute -top-1 -right-1 h-6 w-6 ${
                batteryLevel > 80 ? 'text-green-500' : 
                batteryLevel > 50 ? 'text-yellow-500' : 'text-red-500'
              }`} />
            </div>
            <div className="flex flex-col items-center">
              {isCharging && (
                <div className="flex space-x-1">
                  <div className="w-2 h-6 bg-green-500 rounded animate-pulse"></div>
                  <div className="w-2 h-6 bg-green-500 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-6 bg-green-500 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              )}
              <Zap className={`h-8 w-8 mt-2 ${isCharging ? 'text-green-500 animate-pulse' : 'text-blue-600'}`} />
            </div>
            <div className="text-4xl font-bold text-green-600">
              {batteryLevel.toFixed(0)}%
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-4">
          {isCharging ? 'Charging in Progress' : 'Charging Complete'}
        </h2>
        <p className="text-gray-600">Slot {selectedSlot} • {station?.name}</p>
        
        {isCharging && (
          <div className="bg-green-50 p-3 rounded-lg mt-4">
            <div className="flex items-center justify-center space-x-2">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Device Secured in Locker</span>
            </div>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Battery Level</span>
              <span className="font-bold">{batteryLevel.toFixed(0)}%</span>
            </div>
            <Progress value={batteryLevel} className="h-4" />
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Time Elapsed</p>
                <p className="font-semibold">{Math.floor(chargingTime / 60)}:{String(chargingTime % 60).padStart(2, '0')}</p>
              </div>
              <div>
                <p className="text-gray-600">Energy Delivered</p>
                <p className="font-semibold">{(chargingProgress * 0.04).toFixed(1)} Wh</p>
              </div>
              <div>
                <p className="text-gray-600">Current Cost</p>
                <p className="font-semibold">₦{(chargingProgress * 2).toFixed(0)}</p>
              </div>
              <div>
                <p className="text-gray-600">Estimated Time</p>
                <p className="font-semibold">
                  {isCharging ? `${Math.max(0, Math.ceil((100 - batteryLevel) / 1.5))} min` : 'Complete'}
                </p>
              </div>
            </div>

            <Separator />

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Security Status</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-blue-700">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Locker Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Device Monitoring</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Camera Active</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Power Stable</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isCharging ? (
        <div className="space-y-3">
          <Button 
            onClick={handleStopCharging} 
            variant="destructive" 
            className="w-full h-12"
          >
            <Power className="mr-2 h-4 w-4" />
            Stop Charging & Unlock
          </Button>
          <p className="text-xs text-gray-500 text-center">
            You can stop charging and retrieve your device anytime
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-semibold text-green-800">Charging Complete!</p>
              <p className="text-sm text-green-600">Device charged to {batteryLevel.toFixed(0)}% - Ready for pickup</p>
            </div>
          </div>
          <Button onClick={() => setCurrentStep('locker')} className="w-full h-12 bg-green-600 hover:bg-green-700">
            <Unlock className="mr-2 h-4 w-4" />
            Unlock & Retrieve Device
          </Button>
        </div>
      )}
    </div>
  )

  const renderLocker = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative">
          <div className={`h-16 w-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${
            isLockerOpen ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {isLockerOpen ? (
              <Unlock className="h-8 w-8 text-green-600" />
            ) : (
              <Lock className="h-8 w-8 text-gray-600" />
            )}
          </div>
        </div>
        <h2 className="text-2xl font-bold">
          {isLockerOpen ? 'Locker Unlocked' : 'Secure Device Locker'}
        </h2>
        <p className="text-gray-600">Slot {selectedSlot} • {station?.name}</p>
      </div>

      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {!deviceConnected ? (
              <>
                <div className="flex justify-center space-x-4 mb-4">
                  <div className="flex flex-col items-center">
                    <Shield className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-xs text-gray-600">Secure Storage</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Camera className="h-8 w-8 text-purple-600 mb-2" />
                    <span className="text-xs text-gray-600">Monitoring</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Fingerprint className="h-8 w-8 text-green-600 mb-2" />
                    <span className="text-xs text-gray-600">Biometric Lock</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Step 1:</strong> Place your device in the secure locker compartment
                  </p>
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Step 2:</strong> Connect your device to the charging cable
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Step 3:</strong> Close and lock the compartment for security
                  </p>
                </div>

                <Button 
                  onClick={handleDeviceConnect} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <BatteryCharging className="mr-2 h-4 w-4" />
                  Connect Device & Start Charging
                </Button>
              </>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">Device Connected Successfully!</p>
                <p className="text-sm text-green-600">Your device is now charging safely in the locked compartment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isLockerOpen && !deviceConnected && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-yellow-800">Security Notice</span>
          </div>
          <p className="text-sm text-yellow-700">
            Please place your device inside and lock the compartment to ensure security. The locker will auto-lock after 2 minutes of inactivity.
          </p>
        </div>
      )}

      <div className="flex space-x-3">
        <Button variant="outline" onClick={handleLockSlot} className="flex-1">
          <Lock className="mr-2 h-4 w-4" />
          Cancel & Lock
        </Button>
        {deviceConnected && (
          <Button onClick={() => setCurrentStep('charging')} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Monitor className="mr-2 h-4 w-4" />
            Monitor Charging
          </Button>
        )}
      </div>
    </div>
  )

  const getStepContent = () => {
    switch (currentStep) {
      case 'login':
        return renderLogin()
      case 'dashboard':
        return renderDashboard()
      case 'locker':
        return renderLocker()
      case 'charging':
        return renderCharging()
      default:
        return renderLogin()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            ZavZone Terminal
          </DialogTitle>
          <DialogDescription>
            ZavCharge Network access
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {getStepContent()}
        </div>
      </DialogContent>

      {/* Payment Modal for Guest Users */}
      <ZavChargePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={500}
        planType="guest"
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Dialog>
  )
}
