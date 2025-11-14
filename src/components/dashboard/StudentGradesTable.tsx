'use client'

import { useState } from 'react'
import { Trash2, Pencil } from 'lucide-react'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface Grade {
  id: string
  testName: string
  subject: string
  score: number
  maxScore: number
  date: Date
  createdAt: Date
  createdBy: {
    name: string | null
  }
}

interface StudentGradesTableProps {
  grades: Grade[]
  studentId: string
}

export default function StudentGradesTable({ grades, studentId }: StudentGradesTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete(gradeId: string) {
    setIsLoading(true)

    try {
      const res = await fetch(`/api/grades/${gradeId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete grade')
      }

      toast.success('Sınav sonucu silindi')
      window.location.reload()
    } catch (error) {
      toast.error('Sınav sonucu silinirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  function getGradeColor(percentage: number) {
    if (percentage >= 90) return 'bg-green-100 text-green-800'
    if (percentage >= 80) return 'bg-blue-100 text-blue-800'
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800'
    if (percentage >= 60) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sınav</TableHead>
              <TableHead>Ders</TableHead>
              <TableHead>Puan</TableHead>
              <TableHead>Yüzdelik</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Kaydeden</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((grade) => {
              const percentage = (grade.score / grade.maxScore * 100)
              return (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">{grade.testName}</TableCell>
                  <TableCell>{grade.subject}</TableCell>
                  <TableCell>
                    <span className="font-semibold">{grade.score}</span> / {grade.maxScore}
                  </TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(percentage)}>
                      %{percentage.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(grade.date).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {grade.createdBy.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/students/${studentId}/grades/edit/${grade.id}`}>
                        <Button variant="ghost" size="sm" disabled={isLoading}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={isLoading}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu sınav sonucunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(grade.id)}
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
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
