import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import QuizForm from '@/components/dashboard/QuizForm'

export default async function CreateQuizPage() {
  await requireAdmin()

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
        <h1 className="text-3xl font-bold text-gray-900">Yeni Quiz Oluştur</h1>
        <p className="text-gray-600 mt-1">
          Blog yazılarına eklenebilecek interaktif bir quiz oluşturun
        </p>
      </div>

      <QuizForm posts={posts} />
    </div>
  )
}
