'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { Pencil, Trash2, Eye } from 'lucide-react'

interface Notification {
  id: string
  title: string
  content: string
  bgColor: string | null
  isActive: boolean
  startDate: Date | null
  endDate: Date | null
  order: number
  createdAt: Date
  updatedAt: Date
}

interface NotificationsTableProps {
  notifications: Notification[]
}

export default function NotificationsTable({ notifications }: NotificationsTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [previewNotification, setPreviewNotification] = useState<Notification | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/notifications/${deleteId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız')
      }

      toast.success('Bildirim silindi')
      router.refresh()
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Bildirim silinemedi')
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive })
      })

      if (!response.ok) {
        throw new Error('Güncelleme başarısız')
      }

      toast.success(currentActive ? 'Bildirim devre dışı bırakıldı' : 'Bildirim etkinleştirildi')
      router.refresh()
    } catch (error) {
      console.error('Error toggling notification:', error)
      toast.error('İşlem başarısız')
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <>
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Başlangıç</TableHead>
              <TableHead>Bitiş</TableHead>
              <TableHead>Sıra</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Henüz bildirim eklenmedi
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={notification.isActive ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => toggleActive(notification.id, notification.isActive)}
                    >
                      {notification.isActive ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(notification.startDate)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(notification.endDate)}
                  </TableCell>
                  <TableCell>{notification.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewNotification(notification)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Link href={`/dashboard/notifications/${notification.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(notification.id)}
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
            <AlertDialogTitle>Bildirimi sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu bildirimi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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

      {/* Preview Dialog */}
      <AlertDialog open={!!previewNotification} onOpenChange={() => setPreviewNotification(null)}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Bildirim Önizleme</AlertDialogTitle>
          </AlertDialogHeader>
          {previewNotification && (
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: previewNotification.bgColor || '#f3f4f6' }}
            >
              <h3 className="font-semibold text-lg mb-2">{previewNotification.title}</h3>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: previewNotification.content }}
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Kapat</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
