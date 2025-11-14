import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import QuizzesTable from '@/components/dashboard/QuizzesTable'

export default async function QuizzesPage() {
  await requireAdmin()

  const quizzes = await prisma.quiz.findMany({
    include: {
      post: {
        select: {
          id: true,
          title: true,
          slug: true
        }
      },
      _count: {
        select: {
          questions: true,
          submissions: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quizler</h1>
          <p className="text-gray-600 mt-1">
            Blog yazılarına eklenebilecek interaktif quizler oluşturun
          </p>
        </div>
        <Link href="/dashboard/quizzes/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Quiz
          </Button>
        </Link>
      </div>

      <QuizzesTable quizzes={quizzes} />
    </div>
  )
}
