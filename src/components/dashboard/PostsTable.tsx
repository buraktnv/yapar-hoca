'use client'

import { useState } from 'react'
import { Pencil, Trash2, Eye } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  publishedAt: Date | null
  createdAt: Date
  author: {
    name: string | null
    email: string
  }
  categories: {
    id: string
    name: string
  }[]
}

interface PostsTableProps {
  posts: Post[]
}

export default function PostsTable({ posts }: PostsTableProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete(id: string) {
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete post')
      }

      toast.success('Yazı silindi')
      window.location.reload()
    } catch (error) {
      toast.error('Yazı silinirken hata oluştu')
    } finally {
      setIsDeleting(false)
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <p className="text-gray-500">Henüz yazı eklenmemiş</p>
        <Link href="/dashboard/posts/create">
          <Button className="mt-4">İlk Yazıyı Oluştur</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Başlık</TableHead>
            <TableHead>Yazar</TableHead>
            <TableHead>Kategoriler</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium max-w-md">
                <div className="truncate">{post.title}</div>
                <div className="text-xs text-gray-500 truncate">{post.slug}</div>
              </TableCell>
              <TableCell>
                {post.author.name || post.author.email}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {post.categories.map((cat) => (
                    <Badge key={cat.id} variant="outline">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {post.published ? (
                  <Badge className="bg-green-100 text-green-800">
                    Yayında
                  </Badge>
                ) : (
                  <Badge variant="secondary">Taslak</Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString('tr-TR')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {post.published && (
                    <Link href={`/${post.slug}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Link href={`/dashboard/posts/${post.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={isDeleting}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu yazıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(post.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
