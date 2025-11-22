import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import GamesTable from '@/components/dashboard/GamesTable'

export default async function GamesPage() {
  await requireAdmin()

  const games = await prisma.game.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
  })

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Oyunlar</h1>
          <p className="text-gray-600 mt-1">
            Kategorilere eklenebilecek HTML tabanlı interaktif oyunlar
          </p>
        </div>
        <Link href="/dashboard/games/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Oyun
          </Button>
        </Link>
      </div>

      <GamesTable games={games} />
    </div>
  )
}
