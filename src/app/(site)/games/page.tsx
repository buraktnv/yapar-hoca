import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Gamepad2 } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Oyunlar | YaparHoca',
  description: 'Eğitici ve eğlenceli HTML tabanlı interaktif oyunlar',
}

export default async function GamesPage() {
  const games = await prisma.game.findMany({
    where: { isPublished: true },
    include: {
      category: true,
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  // Group games by category
  const gamesByCategory = games.reduce((acc, game) => {
    const categoryId = game.category.id
    if (!acc[categoryId]) {
      acc[categoryId] = {
        category: game.category,
        games: [],
      }
    }
    acc[categoryId].games.push(game)
    return acc
  }, {} as Record<string, { category: typeof games[0]['category']; games: typeof games }>)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Gamepad2 className="h-10 w-10" />
          Oyunlar
        </h1>
        <p className="text-xl text-gray-600">
          Eğitici ve eğlenceli interaktif oyunlarımızı keşfedin
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {games.length} oyun
        </p>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-12">
          <Gamepad2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Henüz oyun eklenmemiş.</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Ana sayfaya dön
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.values(gamesByCategory).map(({ category, games: categoryGames }) => (
            <section key={category.id}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {category.name}
                </h2>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Tümünü gör →
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {categoryGames.map((game) => (
                  <Link key={game.id} href={`/games/${game.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      {game.thumbnailUrl ? (
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <img
                            src={game.thumbnailUrl}
                            alt={game.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                          <Gamepad2 className="h-12 w-12 text-white" />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline">
                            {game.category.name}
                          </Badge>
                        </div>
                        <CardTitle className="line-clamp-2 text-lg">{game.title}</CardTitle>
                        {game.description && (
                          <CardDescription className="line-clamp-2">
                            {game.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
