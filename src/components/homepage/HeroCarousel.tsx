'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSlide {
  id: string
  title: string
  content: string | null
  image: string | null
  linkUrl: string | null
  bgColor: string | null
  order: number
}

interface HeroCarouselProps {
  slides: HeroSlide[]
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-play: change slide every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  if (slides.length === 0) {
    return null
  }

  const currentSlide = slides[currentIndex]

  const slideContent = (
    <>
      {/* Background Image */}
      {currentSlide.image && (
        <Image
          src={currentSlide.image}
          alt={currentSlide.title}
          fill
          className="object-cover"
          priority={currentIndex === 0}
        />
      )}

      {/* Overlay Content */}
      <div className={`${currentSlide.image ? 'absolute inset-0 bg-black/40' : ''} flex items-center justify-center`}>
        <div className="text-center px-8 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {currentSlide.title}
          </h2>
          {currentSlide.content && (
            <p className="text-lg md:text-xl text-white/90">
              {currentSlide.content}
            </p>
          )}
        </div>
      </div>
    </>
  )

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden group">
      {/* Slide Content */}
      {currentSlide.linkUrl ? (
        <Link
          href={currentSlide.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full h-full block"
          style={{ backgroundColor: currentSlide.bgColor || '#1e3a8a' }}
        >
          {slideContent}
        </Link>
      ) : (
        <div
          className="relative w-full h-full block"
          style={{ backgroundColor: currentSlide.bgColor || '#1e3a8a' }}
        >
          {slideContent}
        </div>
      )}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
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
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
