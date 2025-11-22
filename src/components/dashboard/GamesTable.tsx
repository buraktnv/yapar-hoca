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
import { Pencil, Trash2, ExternalLink, Gamepad2 } from 'lucide-react'

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
  isPublished: boolean
  order: number
  category: Category
  createdAt: Date
}

interface GamesTableProps {
  games: Game[]
}

export default function GamesTable({ games }: GamesTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/games/${deleteId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız')
      }

      toast.success('Oyun silindi')
      router.refresh()
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting game:', error)
      toast.error('Oyun silinemedi')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Görsel</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Sıra</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Henüz oyun eklenmedi
                </TableCell>
              </TableRow>
            ) : (
              games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    {game.thumbnailUrl ? (
                      <Image
                        src={game.thumbnailUrl}
                        alt={game.title}
                        width={48}
                        height={48}
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <Gamepad2 className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{game.title}</div>
                      {game.description && (
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {game.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        /{game.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/category/${game.category.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {game.category.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{game.order}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={game.isPublished ? 'default' : 'secondary'}>
                      {game.isPublished ? 'Yayında' : 'Taslak'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/games/${game.slug}`} target="_blank">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Oyunu görüntüle"
                        >
                          <ExternalLink className="h-4 w-4 text-blue-600" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/games/${game.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(game.id)}
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
            <AlertDialogTitle>Oyunu sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu oyunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
