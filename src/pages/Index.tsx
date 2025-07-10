import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { Link } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'

const products = [
  {
    name: "Zavolah 30S Solar System",
    description: "Professional LED Lighting System with Solar Integration",
    image: "/placeholder.svg?height=400&width=600&text=Solar+System"
  },
  {
    name: "Smart Detachable Sofa",
    description: "Modular furniture with built-in charging stations",
    image: "/placeholder.svg?height=400&width=600&text=Smart+Sofa"
  },
  {
    name: "Energy Storage Battery",
    description: "High-capacity lithium battery for renewable energy",
    image: "/placeholder.svg?height=400&width=600&text=Battery+Storage"
  }
]

const partners = [
  "Tesla", "Huawei", "Growatt", "Cworth", "Lafarge", "Dangote"
]

const typingQuestions = [
  { text: "a home?", color: "#FF734d" },
  { text: "a business?", color: "#003f1f" },
  { text: "an institution?", color: "#FFFFFF" }
]

export default function Index() {
  const [currentProduct, setCurrentProduct] = useState(0)
  const { isDarkMode } = useTheme()
  const [typingText, setTypingText] = useState("What makes ")
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  const nextProduct = () => {
    setCurrentProduct((prev) => (prev + 1) % products.length)
  }

  const prevProduct = () => {
    setCurrentProduct((prev) => (prev - 1 + products.length) % products.length)
  }



  // Typing animation effect
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const currentQuestion = typingQuestions[currentTypingIndex]
    const fullText = "What makes " + currentQuestion.text
    
    if (typingText === "What makes ") {
      timeout = setTimeout(() => {
        setTypingText(prev => prev + currentQuestion.text[0])
      }, 100)
    } else if (typingText.length < fullText.length) {
      timeout = setTimeout(() => {
        const nextCharIndex = typingText.length - "What makes ".length
        setTypingText(prev => prev + currentQuestion.text[nextCharIndex])
      }, 100)
    } else {
      timeout = setTimeout(() => {
        setTypingText("What makes ")
        setCurrentTypingIndex((prev) => (prev + 1) % typingQuestions.length)
      }, 2000)
    }
    return () => clearTimeout(timeout)
  }, [typingText, currentTypingIndex])

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  // Mouse tracking for interactive background
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 })
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 })

  const rotate = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [0, 360])

  const handleMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY } = event
    mouseX.set(clientX)
    mouseY.set(clientY)
  }

  return (
    <div 
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isDarkMode ? 'text-white' : 'text-gray-900'} flex flex-col`}
      onMouseMove={handleMouseMove}
    >
      {/* Interactive background effects */}
      <motion.div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(circle 100px at ${smoothX}px ${smoothY}px, rgba(255, 115, 77, 0.15), transparent 50%)`,
        }}
      />

      <motion.div
        className="pointer-events-none fixed w-10 h-10 rounded-full border-2 border-orange-500 z-10"
        style={{
          x: smoothX,
          y: smoothY,
          rotate: rotate,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <Header />

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <section className="relative">
            <div className="grid md:grid-cols-2 gap-12 items-center min-h-[70vh]">
              {/* Left Column - Text Content */}
              <div className="flex flex-col items-start space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    <span 
                      className="block"
                      style={{ 
                        color: typingQuestions[currentTypingIndex].color === '#FFFFFF' && !isDarkMode
                          ? '#1f2937'
                          : typingQuestions[currentTypingIndex].color
                      }}
                    >
                      {typingText}
                      {showCursor && <span className="animate-pulse">|</span>}
                    </span>
                  </h1>
                  
                  <div className="space-y-4">
                    <motion.div 
                      className="flex items-center space-x-3 text-lg"
                      whileHover={{ scale: 1.05, x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-2xl text-green-600">✱</span>
                      <span className="text-green-600 font-medium">Good design, structure</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3 text-lg"
                      whileHover={{ scale: 1.05, x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-2xl text-orange-500">✱</span>
                      <span className="text-orange-500 font-medium">Functional Smart furniture</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3 text-lg"
                      whileHover={{ scale: 1.05, x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-2xl">✱</span>
                      <span className="font-medium">Self owned 24/7 power supply</span>
                    </motion.div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-8">
                    <Link to="/services">
                      <Button 
                        size="lg" 
                        className="bg-orange-500 hover:bg-green-600 text-white font-semibold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105"
                      >
                        SEE MORE DETAILS
                      </Button>
                    </Link>
                    <Link to="/store">
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold px-8 py-3 text-lg transition-all duration-300"
                      >
                        SHOP NOW
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Product Showcase */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative bg-gradient-to-br from-orange-100 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-2xl">
                  <img
                    src={products[currentProduct].image}
                    alt={products[currentProduct].name}
                    className="w-full h-80 object-cover rounded-lg mb-4"
                  />
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">{products[currentProduct].name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{products[currentProduct].description}</p>
                  </div>
                  
                  {/* Product Navigation */}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={prevProduct}
                      className="bg-white/80 backdrop-blur-sm hover:bg-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={nextProduct}
                      className="bg-white/80 backdrop-blur-sm hover:bg-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Product Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {products.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentProduct(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentProduct ? 'bg-orange-500 w-8' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>

      {/* Partners Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">Our Trusted Partners</h2>
        </div>
        <div className="relative">
          <motion.div 
            className="flex space-x-12"
            animate={{ x: [0, -100 * partners.length] }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {partners.concat(partners, partners).map((partner, index) => (
              <div key={index} className="flex-shrink-0">
                <img 
                  src={`/placeholder.svg?text=${partner}&width=150&height=60`} 
                  alt={partner} 
                  className="h-12 opacity-70 hover:opacity-100 transition-opacity duration-300" 
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who have made the switch to sustainable living
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/marketplace">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3"
                >
                  Explore Marketplace
                </Button>
              </Link>
              <Link to="/services">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-3"
                >
                  Get Consultation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
