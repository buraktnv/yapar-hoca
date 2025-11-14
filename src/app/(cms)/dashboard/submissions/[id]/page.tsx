import { requireAdmin } from '@/lib/auth/helpers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/submissions/${id}`, {
    cache: 'no-store',
    headers: {
      'Cookie': await import('next/headers').then(mod => mod.cookies().toString())
    }
  })

  if (!response.ok) {
    notFound()
  }

  const submission = await response.json()
  const percentage = ((submission.score / submission.maxScore) * 100).toFixed(1)

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href={`/dashboard/quizzes/${submission.quiz.id}/submissions`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gönderim Detayı</h1>
            <p className="text-gray-600 mt-1">{submission.quiz.title}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {submission.score} / {submission.maxScore}
            </div>
            <div className="text-lg text-gray-600">{percentage}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Öğrenci</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{submission.user?.name || 'Anonim'}</p>
            <p className="text-sm text-gray-600">{submission.user?.email || '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Gönderim Tarihi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">
              {new Date(submission.createdAt).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(submission.createdAt).toLocaleTimeString('tr-TR')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Durum</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={Number(percentage) >= 70 ? 'default' : 'destructive'} className="text-lg">
              {Number(percentage) >= 70 ? 'Başarılı' : 'Başarısız'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cevaplar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {submission.quiz.questions.map((question: any, index: number) => {
            const userAnswer = submission.answers[question.id]
            const isCorrect = userAnswer === question.correctAnswer

            return (
              <div key={question.id} className={`p-4 rounded-lg border-2 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-lg mb-2">
                      Soru {index + 1}: {question.question}
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-semibold">Öğrenci Cevabı:</span>{' '}
                        <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                          {userAnswer || '(Cevaplanmadı)'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm">
                          <span className="font-semibold">Doğru Cevap:</span>{' '}
                          <span className="text-green-700">{question.correctAnswer}</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Puan: {question.points}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
