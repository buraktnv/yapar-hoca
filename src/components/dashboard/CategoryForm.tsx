'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface CategoryFormProps {
  category?: {
    id: string
    name: string
    slug: string
    description: string | null
    parentId: string | null
  }
  categories?: Array<{
    id: string
    name: string
    slug: string
    level: number
    displayName: string
  }>
}

export default function CategoryForm({ category, categories = [] }: CategoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(category?.name || '')
  const [slug, setSlug] = useState(category?.slug || '')
  const [description, setDescription] = useState(category?.description || '')
  const [parentId, setParentId] = useState<string | null>(category?.parentId || null)

  // Auto-generate slug from name
  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function handleNameChange(value: string) {
    setName(value)
    if (!category) {
      setSlug(generateSlug(value))
    }
  }

  // Filter out the current category and its descendants from parent options
  const availableParents = categories.filter(cat => cat.id !== category?.id)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = category
        ? `/api/categories/${category.id}`
        : '/api/categories'
      const method = category ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, parentId: parentId || null }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save category')
      }

      toast.success(category ? 'Kategori güncellendi' : 'Kategori oluşturuldu')
      router.push('/dashboard/categories')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}</CardTitle>
        <CardDescription>
          Kategori bilgilerini girin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Kategori Adı *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Teknoloji"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="teknoloji"
              required
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500">
              URL'de kullanılacak benzersiz tanımlayıcı (örn: teknoloji)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent">Üst Kategori</Label>
            <Select
              value={parentId || 'none'}
              onValueChange={(value) => setParentId(value === 'none' ? null : value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Üst kategori seçin (opsiyonel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Yok (Üst seviye kategori)</SelectItem>
                {availableParents.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Bu kategorinin altında görüneceği üst kategori. Boş bırakılırsa üst seviye kategori olur.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bu kategori hakkında kısa bir açıklama..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Kaydediliyor...' : category ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
