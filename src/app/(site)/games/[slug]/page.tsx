import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import GameIframe from '@/components/games/GameIframe'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const game = await prisma.game.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
    },
  })

  if (!game) {
    return {
      title: 'Oyun Bulunamadı | YaparHoca',
    }
  }

  return {
    title: `${game.title} | YaparHoca Oyunlar`,
    description: game.description || `${game.title} - ${game.category.name} kategorisinde eğitici oyun`,
    openGraph: {
      title: game.title,
      description: game.description || `${game.title} - ${game.category.name} kategorisinde eğitici oyun`,
      type: 'website',
      images: game.thumbnailUrl ? [game.thumbnailUrl] : [],
    },
  }
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params

  const game = await prisma.game.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
    },
  })

  if (!game) {
    notFound()
  }

  // Get other games in the same category
  const relatedGames = await prisma.game.findMany({
    where: {
      categoryId: game.categoryId,
      isPublished: true,
      NOT: { id: game.id }
    },
    take: 4,
    orderBy: { order: 'asc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href={`/category/${game.category.slug}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {game.category.name}
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {game.title}
            </h1>
            {game.description && (
              <p className="text-gray-600 mb-4">{game.description}</p>
            )}
            <Link href={`/category/${game.category.slug}`}>
              <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                {game.category.name}
              </Badge>
            </Link>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
          <span className="text-sm text-gray-600">Oyun Alanı</span>
        </div>
        <GameIframe htmlContent={game.htmlContent || ''} title={game.title} />
      </div>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Bu Kategorideki Diğer Oyunlar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedGames.map((relatedGame) => (
              <Link
                key={relatedGame.id}
                href={`/games/${relatedGame.slug}`}
                className="group block bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
              >
                {relatedGame.thumbnailUrl ? (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={relatedGame.thumbnailUrl}
                      alt={relatedGame.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl">🎮</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {relatedGame.title}
                  </h3>
                  {relatedGame.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {relatedGame.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Ana sayfaya dön
        </Link>
      </footer>
    </div>
  )
}
