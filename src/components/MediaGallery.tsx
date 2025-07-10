import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Video, Image as ImageIcon } from 'lucide-react'

interface MediaItem {
  type: 'image' | 'video'
  src: string
  thumbnail?: string
  alt: string
  title: string
  orientation: 'landscape' | 'portrait'
  aspectRatio: number
}

interface MediaGalleryProps {
  media: MediaItem[]
  onMediaClick: (media: MediaItem) => void
  className?: string
}

interface LayoutItem extends MediaItem {
  gridClass: string
  heightClass: string
}

export default function MediaGallery({ media, onMediaClick, className = '' }: MediaGalleryProps) {
  const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const arrangeMedia = () => {
      if (isMobile) {
        // On mobile, simple single column layout
        const arranged = media.map(item => ({
          ...item,
          gridClass: 'col-span-1',
          heightClass: item.orientation === 'portrait' ? 'h-80' : 'h-64'
        }))
        setLayoutItems(arranged)
        return
      }

      // Desktop/tablet smart arrangement
      const arranged: LayoutItem[] = []
      const portraitItems = media.filter(item => item.orientation === 'portrait')
      const landscapeItems = media.filter(item => item.orientation === 'landscape')

      // Strategy: Alternate between landscape and portrait groupings
      let portraitIndex = 0
      let landscapeIndex = 0
      let usePortraitGroup = true

      while (portraitIndex < portraitItems.length || landscapeIndex < landscapeItems.length) {
        if (usePortraitGroup && portraitIndex < portraitItems.length) {
          // Add 2 portrait items side by side
          const portraitsToAdd = Math.min(2, portraitItems.length - portraitIndex)
          
          for (let i = 0; i < portraitsToAdd; i++) {
            arranged.push({
              ...portraitItems[portraitIndex + i],
              gridClass: 'col-span-1',
              heightClass: 'h-80'
            })
          }
          portraitIndex += portraitsToAdd
          
          // If we only added one portrait, add another portrait or landscape to balance
          if (portraitsToAdd === 1) {
            if (portraitIndex < portraitItems.length) {
              arranged.push({
                ...portraitItems[portraitIndex],
                gridClass: 'col-span-1',
                heightClass: 'h-80'
              })
              portraitIndex++
            } else if (landscapeIndex < landscapeItems.length) {
              arranged.push({
                ...landscapeItems[landscapeIndex],
                gridClass: 'col-span-1',
                heightClass: 'h-64'
              })
              landscapeIndex++
            }
          }
        } else if (landscapeIndex < landscapeItems.length) {
          // Add 1 landscape item spanning 2 columns
          arranged.push({
            ...landscapeItems[landscapeIndex],
            gridClass: 'col-span-2',
            heightClass: 'h-64'
          })
          landscapeIndex++
        }

        usePortraitGroup = !usePortraitGroup
      }

      setLayoutItems(arranged)
    }

    arrangeMedia()
  }, [media, isMobile])

  const getGridClass = () => {
    if (isMobile) {
      return 'grid grid-cols-1 gap-4'
    }
    return 'grid grid-cols-2 gap-4'
  }

  return (
    <div className={`${getGridClass()} ${className}`}>
      {layoutItems.map((item, index) => (
        <motion.div
          key={`${item.src}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className={`group cursor-pointer ${item.gridClass}`}
          onClick={() => onMediaClick(item)}
        >
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:scale-[1.02]">
            <div className={`relative ${item.heightClass} overflow-hidden`}>
              <img 
                src={item.type === 'video' ? item.thumbnail : item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Video Play Overlay */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-gray-800 ml-1" />
                  </div>
                </div>
              )}
              
              {/* Media Type Badge */}
              <div className="absolute top-3 left-3">
                <Badge variant={item.type === 'video' ? 'default' : 'secondary'}>
                  {item.type === 'video' ? (
                    <Video className="h-3 w-3 mr-1" />
                  ) : (
                    <ImageIcon className="h-3 w-3 mr-1" />
                  )}
                  {item.type}
                </Badge>
              </div>

              {/* Orientation Indicator for Debug (remove in production) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="text-xs">
                    {item.orientation}
                  </Badge>
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click to view in full gallery
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// Hook for determining image orientation from URL or file
export const useImageOrientation = () => {
  const getImageOrientation = (src: string): Promise<'landscape' | 'portrait'> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const orientation = img.width > img.height ? 'landscape' : 'portrait'
        resolve(orientation)
      }
      img.onerror = () => {
        // Default to landscape if image fails to load
        resolve('landscape')
      }
      img.src = src
    })
  }

  const detectOrientationFromDimensions = (width: number, height: number): 'landscape' | 'portrait' => {
    return width > height ? 'landscape' : 'portrait'
  }

  return { getImageOrientation, detectOrientationFromDimensions }
}

// Advanced layout algorithm for larger galleries
export const createAdvancedLayout = (media: MediaItem[]): LayoutItem[] => {
  const portraitItems = media.filter(item => item.orientation === 'portrait')
  const landscapeItems = media.filter(item => item.orientation === 'landscape')
  const arranged: LayoutItem[] = []

  // Advanced masonry-like layout
  let row = 0
  let portraitIndex = 0
  let landscapeIndex = 0

  while (portraitIndex < portraitItems.length || landscapeIndex < landscapeItems.length) {
    const rowType = row % 3

    switch (rowType) {
      case 0: // Landscape + Portrait
        if (landscapeIndex < landscapeItems.length) {
          arranged.push({
            ...landscapeItems[landscapeIndex],
            gridClass: 'col-span-2',
            heightClass: 'h-64'
          })
          landscapeIndex++
        }
        if (portraitIndex < portraitItems.length) {
          arranged.push({
            ...portraitItems[portraitIndex],
            gridClass: 'col-span-1',
            heightClass: 'h-80'
          })
          portraitIndex++
        }
        break

      case 1: // Two Portraits
        for (let i = 0; i < 2 && portraitIndex < portraitItems.length; i++) {
          arranged.push({
            ...portraitItems[portraitIndex],
            gridClass: 'col-span-1',
            heightClass: 'h-80'
          })
          portraitIndex++
        }
        break

      case 2: // Portrait + Landscape
        if (portraitIndex < portraitItems.length) {
          arranged.push({
            ...portraitItems[portraitIndex],
            gridClass: 'col-span-1',
            heightClass: 'h-80'
          })
          portraitIndex++
        }
        if (landscapeIndex < landscapeItems.length) {
          arranged.push({
            ...landscapeItems[landscapeIndex],
            gridClass: 'col-span-2',
            heightClass: 'h-64'
          })
          landscapeIndex++
        }
        break
    }

    row++
  }

  return arranged
}
