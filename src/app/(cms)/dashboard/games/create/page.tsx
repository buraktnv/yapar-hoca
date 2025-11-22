import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import GameForm from '@/components/dashboard/GameForm'

export default async function CreateGamePage() {
  await requireAdmin()

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/dashboard/games">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Oyunlara Dön
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Yeni Oyun Ekle</h1>
        <p className="text-gray-600 mt-1">
          HTML tabanlı yeni bir oyun oluşturun
        </p>
      </div>

      <GameForm categories={categories} />
    </div>
  )
}
