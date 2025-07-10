import { useState } from 'react'
import ZavChargePaymentModal from '../components/ZavChargePaymentModal'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Battery, Zap, Sun, Unlock, Leaf, UserPlus, BarChart3, MapPin, Clock, Phone, Navigation, Search,AlertTriangle, XCircle, Info, Monitor } from 'lucide-react'
import Header from '../components/layout/Header'
import ChargingStationDashboard from '../components/ChargingStationDashboard'
import { useTheme } from '@/contexts/ThemeContext'

const chargingStations = [
  {
    id: 1,
    name: "Zavolah Mobile Station - VI",
    location: "Victoria Island, Lagos",
    status: "Available",
    capacity: "Fast Charging",
    connectors: ["USB-C", "Lightning", "Micro-USB", "Wireless"],
    price: "₦100/hour",
    distance: "2.3 km",
    availability: 8,
    total: 10,
    latitude: 6.4281,
    longitude: 3.4219,
    slots: [
      { id: 'A1', status: 'available', connector: 'USB-C' },
      { id: 'A2', status: 'available', connector: 'Lightning' },
      { id: 'A3', status: 'occupied', connector: 'Wireless' },
      { id: 'A4', status: 'available', connector: 'USB-C' },
      { id: 'A5', status: 'available', connector: 'Lightning' },
      { id: 'A6', status: 'available', connector: 'Micro-USB' },
      { id: 'A7', status: 'available', connector: 'USB-C' },
      { id: 'A8', status: 'occupied', connector: 'Wireless' },
      { id: 'A9', status: 'available', connector: 'Lightning' },
      { id: 'A10', status: 'available', connector: 'USB-C' }
    ]
  },
  {
    id: 2,
    name: "Zavolah Mobile Hub - Ikeja",
    location: "Ikeja, Lagos", 
    status: "Busy",
    capacity: "Standard Charging",
    connectors: ["USB-C", "Lightning", "Micro-USB"],
    price: "₦80/hour",
    distance: "5.7 km",
    availability: 2,
    total: 6,
    latitude: 6.5244,
    longitude: 3.3792,
    slots: [
      { id: 'B1', status: 'occupied', connector: 'USB-C' },
      { id: 'B2', status: 'occupied', connector: 'Lightning' },
      { id: 'B3', status: 'occupied', connector: 'USB-C' },
      { id: 'B4', status: 'occupied', connector: 'Lightning' },
      { id: 'B5', status: 'available', connector: 'Micro-USB' },
      { id: 'B6', status: 'available', connector: 'USB-C' }
    ]
  },
  {
    id: 3,
    name: "Zavolah Mobile Express - Lekki",
    location: "Lekki Peninsula, Lagos",
    status: "Available",
    capacity: "Super Fast Charging",
    connectors: ["USB-C", "Lightning", "Micro-USB", "Wireless"],
    price: "₦120/hour",
    distance: "8.1 km",
    availability: 12,
    total: 15,
    latitude: 6.4698,
    longitude: 3.5852,
    slots: [
      { id: 'C1', status: 'available', connector: 'USB-C' },
      { id: 'C2', status: 'available', connector: 'Lightning' },
      { id: 'C3', status: 'available', connector: 'Wireless' },
      { id: 'C4', status: 'available', connector: 'USB-C' },
      { id: 'C5', status: 'available', connector: 'Lightning' },
      { id: 'C6', status: 'occupied', connector: 'Micro-USB' },
      { id: 'C7', status: 'available', connector: 'Wireless' },
      { id: 'C8', status: 'available', connector: 'USB-C' },
      { id: 'C9', status: 'available', connector: 'Lightning' },
      { id: 'C10', status: 'occupied', connector: 'USB-C' },
      { id: 'C11', status: 'available', connector: 'Wireless' },
      { id: 'C12', status: 'occupied', connector: 'Lightning' },
      { id: 'C13', status: 'available', connector: 'Micro-USB' },
      { id: 'C14', status: 'available', connector: 'USB-C' },
      { id: 'C15', status: 'available', connector: 'Wireless' }
    ]
  }
]

const subscriptionData = {
  accountBalance: 2450.00,
  plan: "Premium",
  status: "Active",
  chargingHistory: [
    { 
      id: "TXN-2024-001", 
      date: "2024-01-15", 
      time: "14:30", 
      station: "Zavolah Mobile Station - VI", 
      slot: "A2",
      cost: "₦200", 
      energy: "4000 mAh",
      duration: "2h 00m",
      connector: "Lightning",
      status: "Completed",
      device: "iPhone 15 Pro"
    },
    { 
      id: "TXN-2024-002", 
      date: "2024-01-12", 
      time: "09:15", 
      station: "Zavolah Mobile Hub - Ikeja", 
      slot: "B5",
      cost: "₦120", 
      energy: "5000 mAh",
      duration: "1h 30m",
      connector: "USB-C",
      status: "Completed",
      device: "Samsung Galaxy S24"
    },
    { 
      id: "TXN-2024-003", 
      date: "2024-01-08", 
      time: "16:45", 
      station: "Zavolah Mobile Express - Lekki", 
      slot: "C7",
      cost: "₦180", 
      energy: "3500 mAh",
      duration: "1h 30m",
      connector: "Wireless",
      status: "Completed",
      device: "iPhone 14"
    },
    { 
      id: "TXN-2024-004", 
      date: "2024-01-05", 
      time: "11:20", 
      station: "Zavolah Mobile Station - VI", 
      slot: "A8",
      cost: "₦100", 
      energy: "4500 mAh",
      duration: "1h 15m",
      connector: "USB-C",
      status: "Completed",
      device: "Google Pixel 8"
    }
  ]
}

export default function ZavCharge() {
  const { isDarkMode } = useTheme()
  const [selectedStation, setSelectedStation] = useState<any>(null)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [isStationDashboardOpen, setIsStationDashboardOpen] = useState(false)
  const [searchLocation, setSearchLocation] = useState("")
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
  const [topUpPlanType, setTopUpPlanType] = useState<'yearly' | 'guest'>('yearly')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500'
      case 'Busy':
        return 'bg-yellow-500'
      case 'Offline':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getAvailabilityPercentage = (available: number, total: number) => {
    return (available / total) * 100
  }

  const handleFindStations = () => {
    setIsMapModalOpen(true)
  }

  const handleLocationSearch = () => {
    // In a real app, this would use Google Maps Geocoding API
    // For now, we'll just show a placeholder
    console.log("Searching for location:", searchLocation)
  }

  const MapPlaceholder = () => (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center relative">
      <div className="text-center">
        <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 mb-2">Interactive Map Coming Soon</p>
        <p className="text-sm text-gray-500">Google Maps integration will be added here</p>
      </div>
      
      {/* Station Markers Placeholder */}
      <div className="absolute top-1/4 left-1/4 bg-green-500 text-white p-2 rounded-full">
        <Zap className="h-4 w-4" />
      </div>
      <div className="absolute top-1/3 right-1/3 bg-yellow-500 text-white p-2 rounded-full">
        <Zap className="h-4 w-4" />
      </div>
      <div className="absolute bottom-1/4 left-1/2 bg-green-500 text-white p-2 rounded-full">
        <Zap className="h-4 w-4" />
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}>
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">ZavCharge Network</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Nigeria's first solar-powered electric vehicle charging network. Clean, fast, and reliable charging solutions.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-gray-900 hover:bg-gray-100"
              onClick={handleFindStations}
            >
              <MapPin className="mr-2 h-5 w-5" />
              Find Stations
            </Button>
            <a
  href="https://wa.me/2348066404608"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900">
    <Phone className="mr-2 h-5 w-5" />
    Get Support
  </Button>
</a>
<Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-gray-900 hover:bg-gray-100"
              onClick={() => window.location.href = '/register'}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Register to Use ZavCharge
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Stats Overview */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Zap className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">50+</div>
                    <p className="text-sm text-gray-600">Charging Stations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Sun className="h-8 w-8 text-yellow-600" />
                  <div>
                    <div className="text-2xl font-bold">100%</div>
                    <p className="text-sm text-gray-600">Solar Powered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">5,000+</div>
                    <p className="text-sm text-gray-600">CO₂ Tons Saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">98.5%</div>
                    <p className="text-sm text-gray-600">Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Subscription Dashboard */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Zap className="mr-2 h-6 w-6" />
                ZavCharge Subscription Dashboard
              </CardTitle>
              <CardDescription className="text-blue-100">ATM-style charging network access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-white">Account Balance</h3>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-white">₦2,450.00</div>
                    <div className="text-sm text-blue-100">Credits Available</div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Active Subscription</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-white">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-white text-green-600 hover:bg-gray-100"
                      onClick={() => {
                        setTopUpPlanType('yearly')
                        setIsTopUpModalOpen(true)
                      }}
                    >
                      Top Up Credits (₦13,000/year)
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-white text-white hover:bg-white/20"
                      onClick={() => {
                        setTopUpPlanType('guest')
                        setIsTopUpModalOpen(true)
                      }}
                    >
                      Guest Access (₦500)
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-white">Station Access</h3>
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => setIsStationDashboardOpen(true)}
                    >
                      <Monitor className="mr-2 h-4 w-4" />
                      Access Station Terminal
                    </Button>
                    <p className="text-xs text-blue-100">ATM-style interface for charging access</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Charging Stations */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Nearby Charging Stations</h2>
          <div className="grid gap-6">
            {chargingStations.map((station) => (
              <Card key={station.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedStation(station)}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{station.name}</h3>
                      <p className="text-gray-600 flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {station.location} • {station.distance}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(station.status)}>
                        {station.status}
                      </Badge>
                      <p className="text-sm font-semibold mt-1">{station.price}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Capacity</p>
                      <p className="font-semibold">{station.capacity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Available</p>
                      <p className="font-semibold">{station.availability}/{station.total}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Connectors</p>
                      <p className="font-semibold">{station.connectors.length} types</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Est. Wait</p>
                      <p className="font-semibold">
                        {station.status === 'Available' ? '0 min' : '15 min'}
                      </p>
                    </div>
                  </div>

                  {/* Real-time Slot Status */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Real-time Slot Status</p>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
                      {station.slots.map((slot) => (
                        <div 
                          key={slot.id}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all hover:scale-110 ${
                            slot.status === 'available' 
                              ? 'bg-green-500 shadow-green-300 shadow-md' 
                              : 'bg-red-500 shadow-red-300 shadow-md'
                          }`}
                          title={`Slot ${slot.id}: ${slot.status} (${slot.connector})`}
                        >
                          {slot.status === 'available' ? '✓' : '●'}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span>Available</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span>Occupied</span>
                        </div>
                      </div>
                      <span className="text-gray-500">Real-time updates</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Availability</span>
                      <span>{Math.round(getAvailabilityPercentage(station.availability, station.total))}%</span>
                    </div>
                    <Progress value={getAvailabilityPercentage(station.availability, station.total)} className="h-2" />
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    {station.connectors.map((connector, index) => (
                      <Badge key={index} variant="outline">{connector}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Subscription Charging History */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-6 w-6" />
                Subscription Charging History
              </CardTitle>
              <CardDescription>Your recent charging sessions and transaction details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptionData.chargingHistory.map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{session.station}</p>
                        <p className="text-sm text-gray-600">Slot {session.slot} • {session.connector} connector</p>
                        <p className="text-xs text-gray-500">Transaction ID: {session.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{session.cost}</p>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600">{session.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Date</p>
                        <p className="font-medium">{session.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Time</p>
                        <p className="font-medium">{session.time}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Energy</p>
                        <p className="font-medium">{session.energy}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duration</p>
                        <p className="font-medium">{session.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Sessions This Month</p>
                    <p className="text-2xl font-bold">{subscriptionData.chargingHistory.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Energy Consumed</p>
                    <p className="text-2xl font-bold">
                      {subscriptionData.chargingHistory.reduce((total, session) => 
                        total + parseInt(session.energy.replace(' kWh', '')), 0
                      )} kWh
                    </p>
                  </div>
                  <Button variant="outline">
                    Download Statement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Environmental Impact */}
        <section className="mb-12 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-8">
          <div className="text-center">
            <Leaf className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Your Environmental Impact</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold">2.5 tons</div>
                <p>CO₂ Emissions Avoided</p>
              </div>
              <div>
                <div className="text-3xl font-bold">1,200 kWh</div>
                <p>Clean Energy Consumed</p>
              </div>
              <div>
                <div className="text-3xl font-bold">15 trees</div>
                <p>Equivalent Trees Planted</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card>
            <CardContent className="pt-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Go Electric?</h2>
              <p className="text-lg text-gray-600 mb-6">
                Join the ZavCharge network and start your journey towards sustainable transportation
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Download ZavCharge App
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Map Modal */}
      <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Find Charging Stations</DialogTitle>
            <DialogDescription>
              Locate ZavCharge stations near you with real-time availability
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex space-x-2">
              <div className="flex-grow">
                <Label htmlFor="location-search">Search Location</Label>
                <Input
                  id="location-search"
                  placeholder="Enter address, city, or landmark..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleLocationSearch} className="bg-green-600 hover:bg-green-700">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
            
            {/* Map Area */}
            <div className="border rounded-lg p-4">
              <MapPlaceholder />
            </div>
            
            {/* Station List */}
            <div className="grid gap-4 max-h-60 overflow-y-auto">
              {chargingStations.map((station) => (
                <div key={station.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(station.status)}`}></div>
                    <div>
                      <h4 className="font-semibold">{station.name}</h4>
                      <p className="text-sm text-gray-600">{station.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{station.distance}</p>
                    <p className="text-xs text-gray-500">{station.availability}/{station.total} available</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedStation(station)
                      setIsMapModalOpen(false)
                    }}
                  >
                    <Navigation className="mr-1 h-3 w-3" />
                    Navigate
                  </Button>
                </div>
              ))}
            </div>
            
           {/* Instructions */}
<div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
  <h3 className="text-lg font-bold text-blue-900 mb-4">How to use:</h3>
  <ul className="text-base text-gray-800 space-y-3">
    <li className="flex items-center gap-2">
      <MapPin className="text-green-600 h-5 w-5" />
      <span><span className="font-medium text-green-700">Green markers</span> = Available stations</span>
    </li>
    <li className="flex items-center gap-2">
      <AlertTriangle className="text-yellow-500 h-5 w-5" />
      <span><span className="font-medium text-yellow-600">Yellow markers</span> = Busy stations</span>
    </li>
    <li className="flex items-center gap-2">
      <XCircle className="text-red-600 h-5 w-5" />
      <span><span className="font-medium text-red-700">Red markers</span> = Offline stations</span>
    </li>
    <li className="flex items-center gap-2">
      <Info className="text-blue-600 h-5 w-5" />
      <span>Click on markers for station details</span>
    </li>
    <li className="flex items-center gap-2">
      <MapPin className="text-purple-600 h-5 w-5" />
      <span>Use navigation to get directions</span>
    </li>
  </ul>
</div>
          </div>
        </DialogContent>
      </Dialog>

      
      
      {/* Footer Enhancement Section */}
      <div className={`py-8 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Quick Actions</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Button variant="link" className="p-0 h-auto text-left" onClick={handleFindStations}>
                    Find Nearest Station
                  </Button>
                </li>
                <li>
  <a href="https://wa.me/2348066404608?text=Hello%20Zavi,%20I%20want%20to%20report%20an%20issue." target="_blank" rel="noopener noreferrer">
    <Button variant="link" className="p-0 h-auto text-left">
      Report Issue
    </Button>
  </a>
</li>
<li>
  <a href="https://wa.me/2348066404608?text=Hello%20Zavi,%20I%20need%20support%20on." target="_blank" rel="noopener noreferrer">
    <Button variant="link" className="p-0 h-auto text-left">
      Customer Support
    </Button>
  </a>
</li>
</ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Station Features</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• 24/7 availability</li>
                <li>• Multiple connector types</li>
                <li>• Safe storage</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Payment Options</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Mobile app payments</li>
                <li>• Bank Transfer</li>
                <li>• Subscription plans</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Environmental Impact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span>100% Clean Energy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-yellow-600" />
                  <span>Solar Powered Network</span>
                </div>
                <div className="flex items-center space-x-2">
  <Unlock className="h-4 w-4 text-green-600" />
  <span>Open Access</span>
</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <p>&copy; Zavolah ZavCharge Network.</p>
              <p>Developed with 💚 for borderless energy access</p>
            </div>
          </div>
        </div>
      </div>

      {/* ATM-Style Charging Station Dashboard */}
      <ChargingStationDashboard 
        station={chargingStations[0]} // Use first station as default
        isOpen={isStationDashboardOpen}
        onClose={() => setIsStationDashboardOpen(false)}
      />

      {/* Top-up Payment Modal */}
      <ZavChargePaymentModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        amount={topUpPlanType === 'yearly' ? 13000 : 500}
        planType={topUpPlanType}
        onPaymentSuccess={(data) => {
          setIsTopUpModalOpen(false)
          console.log('Payment successful:', data)
        }}
      />
    </div>
  )
}
