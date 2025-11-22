'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

interface GameIframeProps {
  htmlContent: string
  title: string
}

export default function GameIframe({ htmlContent, title }: GameIframeProps) {
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Set a timeout to hide loading after a short delay
    // since srcDoc might not trigger onLoad reliably
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [htmlContent])

  if (!htmlContent) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Oyun içeriği bulunamadı
      </div>
    )
  }

  return (
    <div className="relative" style={{ minHeight: '600px' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Oyun yükleniyor...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent}
        title={title}
        className="w-full border-0"
        style={{ height: '600px' }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}
