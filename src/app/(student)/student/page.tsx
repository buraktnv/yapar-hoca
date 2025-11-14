import { requireAuth } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Award } from 'lucide-react'
import Link from 'next/link'

export default async function StudentHomePage() {
  const user = await requireAuth()

  // Get student statistics
  const [notesCount, gradesCount, recentNotes, recentGrades] = await Promise.all([
    prisma.note.count({ where: { userId: user.id } }),
    prisma.grade.count({ where: { userId: user.id } }),
    prisma.note.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        createdBy: { select: { name: true } }
      }
    }),
    prisma.grade.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 5
    })
  ])

  // Calculate average grade
  const averageGrade = gradesCount > 0
    ? recentGrades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / recentGrades.length
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hoş Geldin!</h1>
        <p className="text-gray-600 mt-2">Akademik gelişimini buradan takip edebilirsin.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Not</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Öğretmenlerinden notlar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sınav Sayısı</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gradesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Toplam sınav sonucu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageGrade > 0 ? averageGrade.toFixed(1) : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Son 5 sınav ortalaması
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Son Notlar</CardTitle>
              <CardDescription>Öğretmenlerinden gelen son notlar</CardDescription>
            </div>
            <Link href="/student/notes" className="text-sm text-blue-600 hover:underline">
              Tümünü Gör
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentNotes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Henüz not yok
            </p>
          ) : (
            <div className="space-y-4">
              {recentNotes.map((note) => (
                <div key={note.id} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900">{note.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {note.createdBy.name} • {new Date(note.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Grades */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Son Sınav Sonuçları</CardTitle>
              <CardDescription>En son sınav sonuçların</CardDescription>
            </div>
            <Link href="/student/grades" className="text-sm text-blue-600 hover:underline">
              Tümünü Gör
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentGrades.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Henüz sınav sonucu yok
            </p>
          ) : (
            <div className="space-y-3">
              {recentGrades.map((grade) => {
                const percentage = (grade.score / grade.maxScore * 100).toFixed(1)
                return (
                  <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{grade.testName}</p>
                      <p className="text-sm text-gray-600">{grade.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(grade.date).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{grade.score}</p>
                      <p className="text-sm text-gray-600">/ {grade.maxScore}</p>
                      <p className="text-xs text-gray-500 mt-1">%{percentage}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
