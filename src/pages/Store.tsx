import { useState } from 'react'
import { ShoppingCart, CreditCard, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useTheme } from '@/contexts/ThemeContext'

const products = [
  // Renewable Energy Products
  { 
    id: 1, 
    name: "Solar Battery 100Ah", 
    category: "Renewable Energy", 
    price: 299999, // in Kobo (₦2,999.99)
    originalPrice: 399999,
    image: "/placeholder.svg?height=200&width=200&text=Solar+Battery",
    rating: 4.5,
    reviews: 23,
    inStock: true,
    features: ["100Ah Capacity", "Deep Cycle", "5 Year Warranty"]
  },
  { 
    id: 2, 
    name: "Tubular Battery 150Ah", 
    category: "Renewable Energy", 
    price: 499999, 
    image: "/placeholder.svg?height=200&width=200&text=Tubular+Battery",
    rating: 4.7,
    reviews: 18,
    inStock: true,
    features: ["150Ah Capacity", "Tubular Technology", "Long Lifespan"]
  },
  { 
    id: 3, 
    name: "Lithium Battery 200Ah", 
    category: "Renewable Energy", 
    price: 899999, 
    image: "/placeholder.svg?height=200&width=200&text=Lithium+Battery",
    rating: 4.9,
    reviews: 35,
    inStock: true,
    features: ["200Ah Capacity", "Lightweight", "Fast Charging"]
  },
  { 
    id: 4, 
    name: "Solar Panel 300W", 
    category: "Renewable Energy", 
    price: 199999, 
    image: "/placeholder.svg?height=200&width=200&text=Solar+Panel",
    rating: 4.6,
    reviews: 42,
    inStock: true,
    features: ["300W Output", "Monocrystalline", "25 Year Warranty"]
  },
  { 
    id: 5, 
    name: "Solar Panel 500W", 
    category: "Renewable Energy", 
    price: 329999, 
    image: "/placeholder.svg?height=200&width=200&text=500W+Panel",
    rating: 4.8,
    reviews: 29,
    inStock: true,
    features: ["500W High Output", "Bifacial Technology", "Weather Resistant"]
  },
  { 
    id: 6, 
    name: "Solar Powered Boat Engine", 
    category: "Renewable Energy", 
    price: 1299999, 
    image: "/placeholder.svg?height=200&width=200&text=Boat+Engine",
    rating: 4.4,
    reviews: 8,
    inStock: false,
    features: ["Silent Operation", "Zero Emissions", "Marine Grade"]
  },
  { 
    id: 7, 
    name: "Solar Iron", 
    category: "Renewable Energy", 
    price: 79999, 
    image: "/placeholder.svg?height=200&width=200&text=Solar+Iron",
    rating: 4.2,
    reviews: 56,
    inStock: true,
    features: ["Cordless", "Temperature Control", "Energy Efficient"]
  },
  { 
    id: 8, 
    name: "Solar Freezer 200L", 
    category: "Renewable Energy", 
    price: 899999, 
    image: "/placeholder.svg?height=200&width=200&text=Solar+Freezer",
    rating: 4.6,
    reviews: 15,
    inStock: true,
    features: ["200L Capacity", "DC Compressor", "Low Power Consumption"]
  },

  // Smart Furniture Products
  { 
    id: 9, 
    name: "Smart Detachable Sofa", 
    category: "Smart Furniture", 
    price: 799999, 
    image: "/placeholder.svg?height=200&width=200&text=Smart+Sofa",
    rating: 4.5,
    reviews: 31,
    inStock: true,
    features: ["Modular Design", "USB Charging", "Premium Fabric"]
  },
  { 
    id: 10, 
    name: "Cupboard Mattress Bed", 
    category: "Smart Furniture", 
    price: 1299999, 
    image: "/placeholder.svg?height=200&width=200&text=Murphy+Bed",
    rating: 4.7,
    reviews: 22,
    inStock: true,
    features: ["Space Saving", "Memory Foam", "Easy Mechanism"]
  },
  { 
    id: 11, 
    name: "Adjustable Standing Desk", 
    category: "Smart Furniture", 
    price: 499999, 
    image: "/placeholder.svg?height=200&width=200&text=Standing+Desk",
    rating: 4.6,
    reviews: 67,
    inStock: true,
    features: ["Height Adjustable", "Cable Management", "Ergonomic Design"]
  },
  { 
    id: 12, 
    name: "Smart Wardrobe", 
    category: "Smart Furniture", 
    price: 699999, 
    image: "/placeholder.svg?height=200&width=200&text=Smart+Wardrobe",
    rating: 4.4,
    reviews: 19,
    inStock: true,
    features: ["LED Lighting", "Mirror Door", "Organizational System"]
  },

  // Construction Products
  { 
    id: 13, 
    name: "Smart Measuring Tape", 
    category: "Construction", 
    price: 199999, 
    image: "/placeholder.svg?height=200&width=200&text=Smart+Tape",
    rating: 4.3,
    reviews: 38,
    inStock: true,
    features: ["Digital Display", "Bluetooth Sync", "High Accuracy"]
  },
  { 
    id: 14, 
    name: "Laser Level Tool", 
    category: "Construction", 
    price: 299999, 
    image: "/placeholder.svg?height=200&width=200&text=Laser+Level",
    rating: 4.7,
    reviews: 44,
    inStock: true,
    features: ["360° Rotation", "Self-Leveling", "Long Range"]
  }
  
]

const faqItems = [
  {
    question: "Your Orders",
    answer: "To review the status of your order please visit the \"My Orders\" section of your Account. You should receive an email notification when your package is dispatched. We dispatch all orders within 24 hours of being placed. For inquiries, contact us at sales@zavolah.com or call +2348066404608"
  },
  {
    question: "Returns & Exchanges", 
    answer: "We offer a 30-day return policy for all products in original condition. Contact our customer service team to initiate a return. Shipping costs for returns are covered by the customer unless the item is defective."
  },
  {
    question: "Payment",
    answer: "We accept various payment methods including bank transfers, USSD, and card payments. All transactions are secure and processed through our certified payment partners."
  },
  {
    question: "Shipping Rates",
    answer: "Shipping is free for orders above ₦50,000 within Nigeria. For orders below this amount, shipping costs vary by location. Express delivery is available for urgent orders at additional cost."
  },
  {
    question: "Warranty",
    answer: "All our products come with manufacturer warranty. Solar panels come with 25-year warranty, batteries have 3-5 year warranty, and furniture has 2-year warranty against manufacturing defects."
  },
  {
    question: "Currency",
    answer: "Our website automatically selects the currency that matches your delivery location. You can change this manually in the top left hand corner of the page. For deliveries to the NG, we will bill you in (#) to the UK in Pounds Sterling (£), to the European Union in Euros (€), to the US in Dollars ($), and to the Rest of World in Pounds Sterling (£). Standard rate VAT is included in all orders to the NG, UK and Europe. Orders to the Rest of the World do not include VAT. Where applicable, you will be responsible for any local country import duty."
  },
  {
    question: "Suspect Fraud?",
    answer: "Given our high levels of security, it's very unlikely fraudulent use of your card will take place on our website. But if a fraudulent transaction does take place, first contact your credit or debit card company so they can protect your card and reimburse you. Then let us know at sales@zavolah.com and we will work with your card company to minimise any further inconvenience to you."
  }

]

export default function Store() {
  const { isDarkMode } = useTheme()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { toast } = useToast()

  const addToCart = (product: any) => {
    setCartItems([...cartItems, product])
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const formatPrice = (priceInKobo: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      minimumFractionDigits: 0 
    }).format(priceInKobo / 100)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || 
                           (selectedCategory === "renewable" && product.category === "Renewable Energy") ||
                           (selectedCategory === "furniture" && product.category === "Smart Furniture") ||
                           (selectedCategory === "construction" && product.category === "Construction")
    return matchesSearch && matchesCategory
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}>
      <Header 
        cartItems={cartItems}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={true}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Zavolah Store</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover our range of renewable energy solutions, smart furniture, and construction tools
          </p>
        </div>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Products ({products.length})</TabsTrigger>
            <TabsTrigger value="renewable">
              Renewable Energy ({products.filter(p => p.category === "Renewable Energy").length})
            </TabsTrigger>
            <TabsTrigger value="furniture">
              Smart Furniture ({products.filter(p => p.category === "Smart Furniture").length})
            </TabsTrigger>
            <TabsTrigger value="construction">
              Construction ({products.filter(p => p.category === "Construction").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-8">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="relative">
                      <div className="relative overflow-hidden rounded-lg">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive">Out of Stock</Badge>
                          </div>
                        )}
                        {product.originalPrice && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex">{renderStars(product.rating)}</div>
                        <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-green-600">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        
                        {product.features && (
                          <div className="flex flex-wrap gap-1">
                            {product.features.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="space-y-2">
                      <Button 
                        onClick={() => addToCart(product)} 
                        disabled={!product.inStock}
                        className="w-full bg-orange-500 hover:bg-green-600 disabled:opacity-50"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <section className="mt-16 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible>
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-8 w-8 text-green-600" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Quality Guaranteed</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Free Shipping ₦50k+</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
