'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Notification {
  id: string
  title: string
  content: string
  bgColor: string | null
  order: number
}

interface NotificationBannerProps {
  notifications: Notification[]
}

export default function NotificationBanner({ notifications }: NotificationBannerProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load dismissed notifications from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem('dismissedNotifications')
    if (dismissed) {
      setDismissedIds(JSON.parse(dismissed))
    }
    setIsLoaded(true)
  }, [])

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissedIds, id]
    setDismissedIds(newDismissed)
    localStorage.setItem('dismissedNotifications', JSON.stringify(newDismissed))
  }

  const visibleNotifications = notifications.filter(
    (notification) => !dismissedIds.includes(notification.id)
  )

  // Don't render anything until localStorage is checked
  if (!isLoaded) {
    return null
  }

  if (visibleNotifications.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className="relative px-4 py-3 rounded-lg shadow-sm"
          style={{ backgroundColor: notification.bgColor || '#f3f4f6' }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{notification.title}</h3>
              <div
                className="tinymce-content"
                dangerouslySetInnerHTML={{ __html: notification.content }}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDismiss(notification.id)}
              className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
