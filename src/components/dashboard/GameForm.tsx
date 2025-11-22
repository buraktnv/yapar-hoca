'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Upload, X, FileCode, Eye } from 'lucide-react'
import { uploadImage } from '@/lib/storage'

interface Category {
  id: string
  name: string
  slug: string
}

interface Game {
  id: string
  title: string
  slug: string
  description: string | null
  htmlContent: string | null
  thumbnailUrl: string | null
  categoryId: string
  isPublished: boolean
  order: number
}

interface GameFormProps {
  game?: Game
  categories: Category[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function GameForm({ game, categories }: GameFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const [title, setTitle] = useState(game?.title || '')
  const [slug, setSlug] = useState(game?.slug || '')
  const [description, setDescription] = useState(game?.description || '')
  const [htmlContent, setHtmlContent] = useState(game?.htmlContent || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(game?.thumbnailUrl || '')
  const [categoryId, setCategoryId] = useState(game?.categoryId || '')
  const [isPublished, setIsPublished] = useState(game?.isPublished ?? false)
  const [order, setOrder] = useState(game?.order ?? 0)

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!game) {
      setSlug(slugify(value))
    }
  }

  const handleHtmlFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      toast.error('Sadece HTML dosyaları yüklenebilir')
      return
    }

    try {
      const text = await file.text()
      setHtmlContent(text)
      toast.success('HTML dosyası yüklendi')
    } catch (error) {
      console.error('Error reading HTML file:', error)
      toast.error('HTML dosyası okunamadı')
    }
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları yüklenebilir')
      return
    }

    setIsUploadingThumbnail(true)
    try {
      const url = await uploadImage(file)
      setThumbnailUrl(url)
      toast.success('Görsel yüklendi')
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      toast.error('Görsel yüklenemedi')
    } finally {
      setIsUploadingThumbnail(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Başlık gereklidir')
      return
    }

    if (!slug.trim()) {
      toast.error('Slug gereklidir')
      return
    }

    if (!htmlContent.trim()) {
      toast.error('HTML içeriği gereklidir')
      return
    }

    if (!categoryId) {
      toast.error('Kategori seçilmelidir')
      return
    }

    setIsSubmitting(true)

    try {
      const url = game ? `/api/games/${game.id}` : '/api/games'

      const response = await fetch(url, {
        method: game ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description: description || null,
          htmlContent,
          thumbnailUrl: thumbnailUrl || null,
          categoryId,
          isPublished,
          order
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'İşlem başarısız')
      }

      toast.success(game ? 'Oyun güncellendi' : 'Oyun oluşturuldu')
      router.push('/dashboard/games')
      router.refresh()
    } catch (error) {
      console.error('Error saving game:', error)
      toast.error(error instanceof Error ? error.message : 'Oyun kaydedilemedi')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Oyun Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Oyun başlığı"
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="oyun-slug"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              URL&apos;de görünecek: /games/{slug || 'oyun-slug'}
            </p>
          </div>

          <div>
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Oyun açıklaması (isteğe bağlı)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="categoryId">Kategori *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="order">Sıralama</Label>
            <Input
              id="order"
              type="number"
              min="0"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
            <p className="text-sm text-gray-500 mt-1">
              Düşük sayılar önce gösterilir
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublished"
              checked={isPublished}
              onCheckedChange={(checked) => setIsPublished(checked as boolean)}
            />
            <Label htmlFor="isPublished" className="cursor-pointer">
              Yayınla
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>HTML İçeriği *</span>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".html,.htm"
                onChange={handleHtmlFileUpload}
                className="hidden"
                id="html-file-upload"
              />
              <Label
                htmlFor="html-file-upload"
                className="cursor-pointer inline-flex items-center gap-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              >
                <FileCode className="h-4 w-4" />
                Dosyadan Yükle
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {showPreview ? 'Düzenle' : 'Önizle'}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            HTML, CSS ve JavaScript içeren tam oyun kodunu girin. Oyun bu içerikle render edilecektir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showPreview ? (
            <div className="border rounded-lg overflow-hidden bg-white" style={{ minHeight: '400px' }}>
              {htmlContent ? (
                <iframe
                  srcDoc={htmlContent}
                  title="Game Preview"
                  className="w-full border-0"
                  style={{ height: '500px' }}
                  sandbox="allow-scripts"
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  HTML içeriği girilmemiş
                </div>
              )}
            </div>
          ) : (
            <Textarea
              id="htmlContent"
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder={`<!DOCTYPE html>
<html>
<head>
  <style>
    /* CSS kodları */
  </style>
</head>
<body>
  <!-- Oyun içeriği -->
  <script>
    // JavaScript kodları
  </script>
</body>
</html>`}
              rows={20}
              className="font-mono text-sm"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Önizleme Görseli</CardTitle>
          <CardDescription>
            Oyun listesinde gösterilecek küçük resim (isteğe bağlı)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {thumbnailUrl ? (
            <div className="relative inline-block">
              <Image
                src={thumbnailUrl}
                alt="Thumbnail"
                width={300}
                height={200}
                className="rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setThumbnailUrl('')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 max-w-sm">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
                id="thumbnail-upload"
                disabled={isUploadingThumbnail}
              />
              <label
                htmlFor="thumbnail-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {isUploadingThumbnail ? 'Yükleniyor...' : 'Görsel yüklemek için tıklayın'}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF
                </span>
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting || isUploadingThumbnail}>
          {isSubmitting ? 'Kaydediliyor...' : game ? 'Güncelle' : 'Oluştur'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/games')}
        >
          İptal
        </Button>
      </div>
    </form>
  )
}
