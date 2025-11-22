import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import GameForm from '@/components/dashboard/GameForm'

export default async function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params

  const [game, categories] = await Promise.all([
    prisma.game.findUnique({
      where: { id }
    }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: { name: 'asc' }
    })
  ])

  if (!game) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/dashboard/games">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Oyunlara Dön
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Oyunu Düzenle</h1>
        <p className="text-gray-600 mt-1">
          {game.title}
        </p>
      </div>

      <GameForm game={game} categories={categories} />
    </div>
  )
}
