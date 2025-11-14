'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Upload, X } from 'lucide-react'
import { uploadImage } from '@/lib/storage'

interface HeroSlide {
  id: string
  title: string
  content: string | null
  image: string | null
  linkUrl: string | null
  bgColor: string | null
  isActive: boolean
  order: number
}

interface HeroSlideFormProps {
  heroSlide?: HeroSlide
}

export default function HeroSlideForm({ heroSlide }: HeroSlideFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [title, setTitle] = useState(heroSlide?.title || '')
  const [content, setContent] = useState(heroSlide?.content || '')
  const [image, setImage] = useState(heroSlide?.image || '')
  const [linkUrl, setLinkUrl] = useState(heroSlide?.linkUrl || '')
  const [bgColor, setBgColor] = useState(heroSlide?.bgColor || '#1e3a8a')
  const [isActive, setIsActive] = useState(heroSlide?.isActive ?? true)
  const [order, setOrder] = useState(heroSlide?.order ?? 0)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const url = await uploadImage(file)
      setImage(url)
      toast.success('Görsel yüklendi')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Görsel yüklenemedi')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Başlık gereklidir')
      return
    }

    setIsSubmitting(true)

    try {
      const url = heroSlide
        ? `/api/hero-slides/${heroSlide.id}`
        : '/api/hero-slides'

      const response = await fetch(url, {
        method: heroSlide ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: content || null,
          image: image || null,
          linkUrl: linkUrl || null,
          bgColor,
          isActive,
          order: Number(order)
        })
      })

      if (!response.ok) {
        throw new Error('İşlem başarısız')
      }

      toast.success(heroSlide ? 'Slider güncellendi' : 'Slider oluşturuldu')
      router.push('/dashboard/hero-slides')
      router.refresh()
    } catch (error) {
      console.error('Error saving hero slide:', error)
      toast.error('Slider kaydedilemedi')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Slider Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Slider başlığı"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">İçerik (İsteğe Bağlı)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Slider açıklaması"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="linkUrl">Link URL (İsteğe Bağlı)</Label>
            <Input
              id="linkUrl"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label>Görsel (İsteğe Bağlı)</Label>
            <div className="mt-2">
              {image ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={title || 'Slider image'}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setImage('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Tıklayın</span> veya sürükleyin
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG veya WEBP</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
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
                  placeholder="#1e3a8a"
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Slider'ı aktif et
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
            className="relative w-full h-64 rounded-lg overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            {image && (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            )}
            <div className={`${image ? 'absolute inset-0 bg-black/30' : ''} flex flex-col items-center justify-center p-8 text-white`}>
              <h2 className="text-3xl font-bold mb-2">{title || 'Slider Başlığı'}</h2>
              {content && <p className="text-lg">{content}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? 'Kaydediliyor...' : heroSlide ? 'Güncelle' : 'Oluştur'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/hero-slides')}
        >
          İptal
        </Button>
      </div>
    </form>
  )
}
