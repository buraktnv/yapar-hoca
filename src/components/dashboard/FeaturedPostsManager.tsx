'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Search, Plus, X, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  author: { name: string | null; email: string }
  categories: { id: string; name: string }[]
}

interface FeaturedPost {
  id: string
  order: number
  post: Post
}

interface FeaturedPostsManagerProps {
  featuredPosts: FeaturedPost[]
  allPosts: Post[]
}

export default function FeaturedPostsManager({
  featuredPosts: initialFeaturedPosts,
  allPosts
}: FeaturedPostsManagerProps) {
  const router = useRouter()
  const [featuredPosts, setFeaturedPosts] = useState(initialFeaturedPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPostId, setSelectedPostId] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // Filter out already featured posts
  const availablePosts = allPosts.filter(
    post => !featuredPosts.some(fp => fp.post.id === post.id)
  )

  // Filter posts by search term
  const filteredPosts = availablePosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddPost = async () => {
    if (!selectedPostId) {
      toast.error('Lütfen bir yazı seçin')
      return
    }

    setIsAdding(true)
    try {
      const response = await fetch('/api/featured-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: selectedPostId,
          order: featuredPosts.length
        })
      })

      if (!response.ok) {
        throw new Error('Ekleme başarısız')
      }

      toast.success('Yazı öne çıkanlara eklendi')
      setSelectedPostId('')
      setSearchTerm('')
      router.refresh()
    } catch (error) {
      console.error('Error adding featured post:', error)
      toast.error('Yazı eklenemedi')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/featured-posts/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Silme başarısız')
      }

      toast.success('Yazı öne çıkanlardan kaldırıldı')
      router.refresh()
    } catch (error) {
      console.error('Error removing featured post:', error)
      toast.error('Yazı kaldırılamadı')
    }
  }

  const movePost = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= featuredPosts.length) return

    const newFeaturedPosts = [...featuredPosts]
    const [movedPost] = newFeaturedPosts.splice(index, 1)
    newFeaturedPosts.splice(newIndex, 0, movedPost)

    // Update local state immediately for smooth UX
    setFeaturedPosts(newFeaturedPosts)

    // Update order in database
    try {
      const items = newFeaturedPosts.map((fp, idx) => ({
        id: fp.id,
        order: idx
      }))

      const response = await fetch('/api/featured-posts/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })

      if (!response.ok) {
        throw new Error('Sıralama güncellenemedi')
      }

      router.refresh()
    } catch (error) {
      console.error('Error reordering posts:', error)
      toast.error('Sıralama güncellenemedi')
      // Revert on error
      setFeaturedPosts(initialFeaturedPosts)
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Post Section */}
      <Card>
        <CardHeader>
          <CardTitle>Yazı Ekle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Yazı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedPostId} onValueChange={setSelectedPostId}>
              <SelectTrigger className="w-[400px]">
                <SelectValue placeholder="Yazı seçin..." />
              </SelectTrigger>
              <SelectContent>
                {filteredPosts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchTerm ? 'Yazı bulunamadı' : 'Tüm yazılar zaten öne çıkan'}
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button onClick={handleAddPost} disabled={isAdding || !selectedPostId}>
              <Plus className="h-4 w-4 mr-2" />
              Ekle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Öne Çıkan Yazılar ({featuredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {featuredPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Henüz öne çıkan yazı eklenmedi
            </div>
          ) : (
            <div className="space-y-3">
              {featuredPosts.map((fp, index) => (
                <div
                  key={fp.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  {/* Drag Handle & Order Controls */}
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => movePost(index, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => movePost(index, 'down')}
                      disabled={index === featuredPosts.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Post Image */}
                  {fp.post.featuredImage ? (
                    <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={fp.post.featuredImage}
                        alt={fp.post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded bg-gray-200 flex-shrink-0" />
                  )}

                  {/* Post Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {fp.post.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">
                        {fp.post.author.name || fp.post.author.email}
                      </span>
                      {fp.post.categories.length > 0 && (
                        <>
                          <span className="text-gray-400">•</span>
                          <div className="flex gap-1 flex-wrap">
                            {fp.post.categories.slice(0, 2).map((cat) => (
                              <Badge key={cat.id} variant="secondary" className="text-xs">
                                {cat.name}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Order Number */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(fp.id)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
