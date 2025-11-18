import { requireAuth } from '@/lib/auth/helpers'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, ExternalLink } from 'lucide-react'

interface QuizSubmission {
  id: string
  score: number
  maxScore: number
  createdAt: string
  quiz: {
    id: string
    title: string
    description: string | null
    showAnswers: boolean
    post: {
      id: string
      title: string
      slug: string
    } | null
  }
}

export default async function StudentQuizzesPage() {
  await requireAuth()

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/submissions/my-submissions`, {
    cache: 'no-store',
    headers: {
      'Cookie': await import('next/headers').then(mod => mod.cookies().toString())
    }
  })

  if (!response.ok) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Quiz geçmişi yüklenirken hata oluştu</p>
      </div>
    )
  }

  const submissions: QuizSubmission[] = await response.json()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quizlerim</h1>
        <p className="text-gray-600 mt-2">
          Tamamladığınız quiz&apos;leri ve sonuçlarınızı görüntüleyin
        </p>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Henüz tamamlanmış quiz bulunmuyor</p>
              <Link href="/">
                <Button>Blog Yazılarına Git</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const percentage = ((submission.score / submission.maxScore) * 100).toFixed(1)
            const isPassed = Number(percentage) >= 70

            return (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {submission.quiz.title}
                      </CardTitle>
                      {submission.quiz.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {submission.quiz.description}
                        </p>
                      )}
                      {submission.quiz.post && (
                        <Link
                          href={`/${submission.quiz.post.slug}`}
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {submission.quiz.post.title}
                        </Link>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {submission.score} / {submission.maxScore}
                      </div>
                      <Badge variant={isPassed ? 'default' : 'destructive'} className="text-sm">
                        {percentage}% - {isPassed ? 'Başarılı' : 'Başarısız'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Tamamlanma Tarihi:{' '}
                      <span className="font-medium">
                        {new Date(submission.createdAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {submission.quiz.showAnswers && (
                      <Link href={`/dashboard/submissions/${submission.id}`}>
                        <Button variant="outline" size="sm">
                          Cevapları Görüntüle
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
