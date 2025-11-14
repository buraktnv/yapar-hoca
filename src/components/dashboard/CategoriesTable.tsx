'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
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

interface Category {
  id: string
  name: string
  slug: string
  displayName?: string
  level?: number
  _count: {
    posts: number
  }
}

interface CategoriesTableProps {
  categories: Category[]
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete(id: string) {
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete category')
      }

      toast.success('Kategori silindi')
      window.location.reload()
    } catch (error) {
      toast.error('Kategori silinirken hata oluştu')
    } finally {
      setIsDeleting(false)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <p className="text-gray-500">Henüz kategori eklenmemiş</p>
        <Link href="/dashboard/categories/create">
          <Button className="mt-4">İlk Kategoriyi Oluştur</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ad (Hiyerarşi)</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Seviye</TableHead>
            <TableHead className="text-center">Yazı Sayısı</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                <span style={{ fontFamily: 'monospace' }}>
                  {category.displayName || category.name}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{category.slug}</Badge>
              </TableCell>
              <TableCell className="max-w-md truncate text-sm text-gray-600">
                {category.level !== undefined && category.level > 0 ?
                  `Alt kategori (Seviye ${category.level + 1})` :
                  'Üst seviye kategori'
                }
              </TableCell>
              <TableCell className="text-center">
                <Badge>{category._count.posts}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/dashboard/categories/${category.id}/edit`}>
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
                          Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                          {category._count.posts > 0 && (
                            <span className="block mt-2 text-red-600">
                              Dikkat: Bu kategoride {category._count.posts} yazı var!
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(category.id)}
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
