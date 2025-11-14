import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import QuizForm from '@/components/dashboard/QuizForm'

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!quiz) {
    notFound()
  }

  // Get all published posts for selection
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      slug: true
    },
    orderBy: { publishedAt: 'desc' }
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quiz Düzenle</h1>
        <p className="text-gray-600 mt-1">
          Quiz bilgilerini ve sorularını düzenleyin
        </p>
      </div>

      <QuizForm quiz={quiz} posts={posts} />
    </div>
  )
}
