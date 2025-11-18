'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'

interface Banner {
  id: string
  title: string
  content: string | null
  image: string | null
  linkUrl: string | null
  isClickable: boolean
  layout: string
  isActive: boolean
  order: number
}

interface BannersTableProps {
  banners: Banner[]
}

export default function BannersTable({ banners }: BannersTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/banners/${deleteId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız')
      }

      toast.success('Banner silindi')
      router.refresh()
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('Banner silinemedi')
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive })
      })

      if (!response.ok) {
        throw new Error('Güncelleme başarısız')
      }

      toast.success(currentActive ? 'Banner devre dışı bırakıldı' : 'Banner etkinleştirildi')
      router.refresh()
    } catch (error) {
      console.error('Error toggling banner:', error)
      toast.error('İşlem başarısız')
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Görsel</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Düzen</TableHead>
              <TableHead>Tıklanabilir</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Sıra</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  Henüz banner eklenmedi
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    {banner.image ? (
                      <div className="relative w-20 h-12 rounded overflow-hidden">
                        <Image
                          src={banner.image}
                          alt={banner.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-12 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                        Yok
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {banner.layout === 'slider' ? 'Slider' : 'Grid'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {banner.isClickable ? (
                      <Badge variant="default" className="bg-green-600">Evet</Badge>
                    ) : (
                      <Badge variant="secondary">Hayır</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={banner.isActive ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => toggleActive(banner.id, banner.isActive)}
                    >
                      {banner.isActive ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </TableCell>
                  <TableCell>{banner.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/banners/${banner.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(banner.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Banner&apos;ı sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu banner'ı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Siliniyor...' : 'Sil'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
