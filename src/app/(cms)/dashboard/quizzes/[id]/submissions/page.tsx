import { requireAdmin } from '@/lib/auth/helpers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import QuizSubmissionsTable from '@/components/dashboard/QuizSubmissionsTable'
import { cookies } from 'next/headers'

export default async function QuizSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params

  // Get cookies for auth
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  // Fetch submissions data
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/quizzes/${id}/submissions`, {
    cache: 'no-store',
    headers: {
      'Cookie': cookieHeader
    }
  })

  if (!response.ok) {
    notFound()
  }

  const data = await response.json()

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/dashboard/quizzes">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quizlere Dön
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">{data.quiz.title}</h1>
        {data.quiz.description && (
          <p className="text-gray-600 mt-1">{data.quiz.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Toplam {data.submissions.length} gönderim
        </p>
      </div>

      <QuizSubmissionsTable submissions={data.submissions} quizId={id} />
    </div>
  )
}
