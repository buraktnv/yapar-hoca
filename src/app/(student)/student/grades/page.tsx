import { requireAuth } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function StudentGradesPage() {
  const user = await requireAuth()

  const grades = await prisma.grade.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
    include: {
      createdBy: {
        select: { name: true }
      }
    }
  })

  // Group grades by subject
  const gradesBySubject = grades.reduce((acc, grade) => {
    if (!acc[grade.subject]) {
      acc[grade.subject] = []
    }
    acc[grade.subject].push(grade)
    return acc
  }, {} as Record<string, typeof grades>)

  // Calculate subject averages
  const subjectAverages = Object.entries(gradesBySubject).map(([subject, subjectGrades]) => {
    const average = subjectGrades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / subjectGrades.length
    return { subject, average, count: subjectGrades.length }
  })

  // Calculate overall average
  const overallAverage = grades.length > 0
    ? grades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / grades.length
    : 0

  function getGradeColor(percentage: number) {
    if (percentage >= 90) return 'bg-green-100 text-green-800'
    if (percentage >= 80) return 'bg-blue-100 text-blue-800'
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800'
    if (percentage >= 60) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sınav Sonuçları</h1>
        <p className="text-gray-600 mt-2">
          Tüm sınav sonuçların ve notların
        </p>
      </div>

      {/* Overall Average */}
      {grades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Genel Ortalama</CardTitle>
            <CardDescription>{grades.length} sınav sonucu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">
              %{overallAverage.toFixed(1)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject Averages */}
      {subjectAverages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ders Ortalamaları</CardTitle>
            <CardDescription>Her dersten aldığın ortalama</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectAverages.map(({ subject, average, count }) => (
                <div key={subject} className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900">{subject}</h4>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    %{average.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {count} sınav
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Grades */}
      <Card>
        <CardHeader>
          <CardTitle>Tüm Sınavlar</CardTitle>
          <CardDescription>Kronolojik sıralama</CardDescription>
        </CardHeader>
        <CardContent>
          {grades.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Henüz hiç sınav sonucun yok.
            </p>
          ) : (
            <div className="space-y-3">
              {grades.map((grade) => {
                const percentage = (grade.score / grade.maxScore * 100)
                return (
                  <div
                    key={grade.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900">{grade.testName}</h4>
                        <Badge variant="outline">{grade.subject}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(grade.date).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Değerlendiren: {grade.createdBy.name}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">{grade.score}</span>
                        <span className="text-lg text-gray-600">/ {grade.maxScore}</span>
                      </div>
                      <Badge className={`mt-2 ${getGradeColor(percentage)}`}>
                        %{percentage.toFixed(1)}
                      </Badge>
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
