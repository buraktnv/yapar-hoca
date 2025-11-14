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
import { Pencil, Trash2, Copy, FileText } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
}

interface Quiz {
  id: string
  title: string
  description: string | null
  isActive: boolean
  showAnswers: boolean
  trackScores: boolean
  post: Post | null
  _count: {
    questions: number
    submissions: number
  }
}

interface QuizzesTableProps {
  quizzes: Quiz[]
}

export default function QuizzesTable({ quizzes }: QuizzesTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/quizzes/${deleteId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız')
      }

      toast.success('Quiz silindi')
      router.refresh()
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting quiz:', error)
      toast.error('Quiz silinemedi')
    } finally {
      setIsDeleting(false)
    }
  }

  const copyShortcode = (quizId: string) => {
    navigator.clipboard.writeText(`[quiz id="${quizId}"]`)
    toast.success('Shortcode kopyalandı')
  }

  return (
    <>
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Blog Yazısı</TableHead>
              <TableHead>Sorular</TableHead>
              <TableHead>Gönderimler</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Henüz quiz eklenmedi
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{quiz.title}</div>
                      {quiz.description && (
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {quiz.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {quiz.post ? (
                      <Link
                        href={`/${quiz.post.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {quiz.post.title}
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-sm">Bağlı değil</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{quiz._count.questions} soru</Badge>
                  </TableCell>
                  <TableCell>
                    {quiz.trackScores ? (
                      <span className="text-sm">{quiz._count.submissions}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={quiz.isActive ? 'default' : 'secondary'}>
                      {quiz.isActive ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {quiz.trackScores && (
                        <Link href={`/dashboard/quizzes/${quiz.id}/submissions`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Gönderileri görüntüle"
                          >
                            <FileText className="h-4 w-4 text-blue-600" />
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyShortcode(quiz.id)}
                        title="Shortcode'u kopyala"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Link href={`/dashboard/quizzes/${quiz.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(quiz.id)}
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
            <AlertDialogTitle>Quiz'i sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu quiz'i silmek istediğinizden emin misiniz? Tüm sorular ve gönderimler de silinecektir. Bu işlem geri alınamaz.
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
