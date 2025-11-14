'use client'

import { useState } from 'react'
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
import { Eye, Download } from 'lucide-react'

interface User {
  id: string
  name: string | null
  email: string
}

interface Submission {
  id: string
  userId: string | null
  user: User | null
  score: number
  maxScore: number
  answers: any
  createdAt: Date
}

interface QuizSubmissionsTableProps {
  submissions: Submission[]
  quizId: string
}

export default function QuizSubmissionsTable({ submissions, quizId }: QuizSubmissionsTableProps) {
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    } else {
      const percentA = (a.score / a.maxScore) * 100
      const percentB = (b.score / b.maxScore) * 100
      return sortOrder === 'desc' ? percentB - percentA : percentA - percentB
    }
  })

  const getScoreBadge = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'default'
    if (percentage >= 60) return 'secondary'
    return 'destructive'
  }

  const exportToCSV = () => {
    const headers = ['Öğrenci', 'Email', 'Puan', 'Maksimum', 'Yüzde', 'Tarih']
    const rows = submissions.map(sub => [
      sub.user?.name || 'Anonim',
      sub.user?.email || '-',
      sub.score,
      sub.maxScore,
      `${((sub.score / sub.maxScore) * 100).toFixed(1)}%`,
      new Date(sub.createdAt).toLocaleString('tr-TR')
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `quiz-submissions-${quizId}-${new Date().toISOString()}.csv`
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'date' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              if (sortBy === 'date') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              } else {
                setSortBy('date')
                setSortOrder('desc')
              }
            }}
          >
            Tarihe Göre {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
          </Button>
          <Button
            variant={sortBy === 'score' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              if (sortBy === 'score') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              } else {
                setSortBy('score')
                setSortOrder('desc')
              }
            }}
          >
            Puana Göre {sortBy === 'score' && (sortOrder === 'desc' ? '↓' : '↑')}
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCSV}
        >
          <Download className="h-4 w-4 mr-2" />
          CSV İndir
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Öğrenci</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Puan</TableHead>
              <TableHead>Yüzde</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Henüz gönderim yapılmadı
                </TableCell>
              </TableRow>
            ) : (
              sortedSubmissions.map((submission) => {
                const percentage = ((submission.score / submission.maxScore) * 100).toFixed(1)

                return (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.user?.name || 'Anonim Kullanıcı'}
                    </TableCell>
                    <TableCell>
                      {submission.user?.email || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getScoreBadge(submission.score, submission.maxScore)}>
                        {submission.score} / {submission.maxScore}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{percentage}%</span>
                    </TableCell>
                    <TableCell>
                      {new Date(submission.createdAt).toLocaleString('tr-TR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/submissions/${submission.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Detay
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
