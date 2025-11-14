'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import MyEditor from '@/components/editor/MyEditor'
import { uploadImage } from '@/lib/storage'

interface Category {
  id: string
  name: string
  slug: string
  level?: number
  displayName?: string
}

interface PostFormProps {
  categories: Category[]
  authorId: string
  post?: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    featuredImage: string | null
    published: boolean
    categories: Category[]
  }
}

export default function PostForm({ categories, authorId, post }: PostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [content, setContent] = useState(post?.content || '')
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '')
  const [published, setPublished] = useState(post?.published || false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories.map(c => c.id) || []
  )

  // Auto-generate slug from title
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

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!post) {
      setSlug(generateSlug(value))
    }
  }

  function toggleCategory(categoryId: string) {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  async function handleImageUpload(file: File): Promise<string> {
    try {
      const url = await uploadImage(file, 'blog-images')
      return url
    } catch (error) {
      toast.error('Resim yüklenirken hata oluştu')
      throw error
    }
  }

  async function handleFeaturedImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await uploadImage(file, 'blog-images')
      setFeaturedImage(url)
      toast.success('Kapak resmi yüklendi')
    } catch (error) {
      toast.error('Kapak resmi yüklenirken hata oluştu')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (selectedCategories.length === 0) {
      toast.error('En az bir kategori seçmelisiniz')
      return
    }

    setIsLoading(true)

    try {
      const url = post ? `/api/posts/${post.id}` : '/api/posts'
      const method = post ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          featuredImage,
          published,
          authorId,
          categoryIds: selectedCategories,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save post')
      }

      toast.success(post ? 'Yazı güncellendi' : 'Yazı oluşturuldu')
      router.push('/dashboard/posts')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Temel Bilgiler</CardTitle>
          <CardDescription>
            Yazının temel bilgilerini girin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Yazı başlığı..."
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
              placeholder="yazi-slug"
              required
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500">
              URL'de kullanılacak benzersiz tanımlayıcı
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Özet</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Yazı hakkında kısa bir özet..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Kapak Resmi</Label>
            <Input
              id="featuredImage"
              type="file"
              accept="image/*"
              onChange={handleFeaturedImageUpload}
              disabled={isLoading}
            />
            {featuredImage && (
              <div className="mt-2">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>İçerik</CardTitle>
          <CardDescription>
            Yazınızın içeriğini oluşturun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MyEditor
            value={content}
            onChange={setContent}
            onImageUpload={handleImageUpload}
            height={600}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kategoriler *</CardTitle>
          <CardDescription>
            Yazınız için kategoriler seçin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                  disabled={isLoading}
                />
                <Label
                  htmlFor={category.id}
                  className="text-sm font-normal cursor-pointer"
                  style={{
                    paddingLeft: `${(category.level || 0) * 20}px`,
                    fontWeight: category.level === 0 ? 600 : 400
                  }}
                >
                  {category.displayName || category.name}
                </Label>
              </div>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="text-sm text-gray-500">
              Henüz kategori yok. <a href="/dashboard/categories/create" className="text-blue-600 hover:underline">Kategori oluşturun</a>
            </p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Birden fazla kategori seçebilirsiniz. Alt kategoriler otomatik olarak üst kategorilerle ilişkilendirilir.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yayın Ayarları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={published}
              onCheckedChange={(checked) => setPublished(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="published" className="cursor-pointer">
              Yazıyı hemen yayınla
            </Label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {published ? 'Yazı kaydedilir kaydedilmez yayınlanacak' : 'Yazı taslak olarak kaydedilecek'}
          </p>
        </CardContent>
      </Card>

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
          {isLoading ? 'Kaydediliyor...' : post ? 'Güncelle' : 'Oluştur'}
        </Button>
      </div>
    </form>
  )
}
