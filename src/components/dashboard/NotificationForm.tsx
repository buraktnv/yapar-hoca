'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import MyEditor from '@/components/editor/MyEditor'
import { toast } from 'sonner'

interface Notification {
  id: string
  title: string
  content: string
  bgColor: string | null
  isActive: boolean
  startDate: Date | null
  endDate: Date | null
  order: number
}

interface NotificationFormProps {
  notification?: Notification
}

export default function NotificationForm({ notification }: NotificationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState(notification?.title || '')
  const [content, setContent] = useState(notification?.content || '')
  const [bgColor, setBgColor] = useState(notification?.bgColor || '#f3f4f6')
  const [isActive, setIsActive] = useState(notification?.isActive ?? false)
  const [startDate, setStartDate] = useState(
    notification?.startDate ? new Date(notification.startDate).toISOString().split('T')[0] : ''
  )
  const [endDate, setEndDate] = useState(
    notification?.endDate ? new Date(notification.endDate).toISOString().split('T')[0] : ''
  )
  const [order, setOrder] = useState(notification?.order ?? 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast.error('Başlık ve içerik gereklidir')
      return
    }

    setIsSubmitting(true)

    try {
      const url = notification
        ? `/api/notifications/${notification.id}`
        : '/api/notifications'

      const response = await fetch(url, {
        method: notification ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          bgColor,
          isActive,
          startDate: startDate || null,
          endDate: endDate || null,
          order: Number(order)
        })
      })

      if (!response.ok) {
        throw new Error('İşlem başarısız')
      }

      toast.success(notification ? 'Bildirim güncellendi' : 'Bildirim oluşturuldu')
      router.push('/dashboard/notifications')
      router.refresh()
    } catch (error) {
      console.error('Error saving notification:', error)
      toast.error('Bildirim kaydedilemedi')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bildirim Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bildirim başlığı"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">İçerik *</Label>
            <div className="mt-2">
              <MyEditor
                value={content}
                onChange={setContent}
                height={200}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bgColor">Arka Plan Rengi</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="bgColor"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="#f3f4f6"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="order">Sıra</Label>
              <Input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">Düşük sayılar önce gösterilir</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Başlangıç Tarihi (İsteğe Bağlı)</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">Bitiş Tarihi (İsteğe Bağlı)</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Bildirimi aktif et
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Önizleme</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: bgColor }}
          >
            <h3 className="font-semibold text-lg mb-2">{title || 'Bildirim Başlığı'}</h3>
            <div
              className="tinymce-content"
              dangerouslySetInnerHTML={{ __html: content || '<p>Bildirim içeriği burada görünecek...</p>' }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Kaydediliyor...' : notification ? 'Güncelle' : 'Oluştur'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/notifications')}
        >
          İptal
        </Button>
      </div>
    </form>
  )
}
