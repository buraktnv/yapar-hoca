'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Banner {
  id: string
  title: string
  content: string | null
  image: string | null
  linkUrl: string | null
  isClickable: boolean
  layout: string
  order: number
}

interface BannersSectionProps {
  banners: Banner[]
}

export default function BannersSection({ banners }: BannersSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (banners.length === 0) {
    return null
  }

  // Determine layout from first banner (all should have same layout)
  const layout = banners[0].layout

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  // Auto-play for slider layout
  useEffect(() => {
    if (layout !== 'slider' || banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [layout, banners.length])

  const renderBanner = (banner: Banner) => {
    const BannerWrapper = banner.isClickable && banner.linkUrl ? Link : 'div'
    const wrapperProps = banner.isClickable && banner.linkUrl
      ? { href: banner.linkUrl, target: '_blank', rel: 'noopener noreferrer' }
      : {}

    return (
      <BannerWrapper
        key={banner.id}
        {...wrapperProps}
        className={`relative rounded-lg overflow-hidden ${
          banner.isClickable ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
        }`}
      >
        {banner.image ? (
          <div className="relative w-full h-64 md:h-80">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover"
            />
            {banner.content && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                  <p className="text-lg">{banner.content}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 h-64 md:h-80 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
              {banner.content && <p className="text-lg">{banner.content}</p>}
            </div>
          </div>
        )}
      </BannerWrapper>
    )
  }

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => renderBanner(banner))}
      </div>
    )
  }

  // Slider layout
  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full flex-shrink-0">
              {renderBanner(banner)}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Navigation */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
