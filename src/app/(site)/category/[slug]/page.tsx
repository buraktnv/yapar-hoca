import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Gamepad2 } from 'lucide-react'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) {
    return {
      title: 'Kategori Bulunamadı | YaparHoca',
    }
  }

  return {
    title: `${category.name} | YaparHoca`,
    description: category.description || `${category.name} kategorisindeki yazılar ve oyunlar`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          categories: true,
        },
        orderBy: { publishedAt: 'desc' },
      },
      games: {
        where: { isPublished: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      },
    },
  })

  if (!category) {
    notFound()
  }

  const hasContent = category.posts.length > 0 || category.games.length > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xl text-gray-600">{category.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          {category.posts.length} yazı • {category.games.length} oyun
        </p>
      </div>

      {!hasContent ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Bu kategoride henüz içerik bulunmuyor.</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Tüm yazılara göz atın
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Games Section */}
          {category.games.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Gamepad2 className="h-6 w-6" />
                Oyunlar
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {category.games.map((game) => (
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
          )}

          {/* Posts Section */}
          {category.posts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Yazılar
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.posts.map((post) => (
                  <Link key={post.id} href={`/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      {post.featuredImage && (
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.categories.map((cat) => (
                            <Badge key={cat.id} variant="outline">
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {post.excerpt || 'Devamını okumak için tıklayın...'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{post.author.name || post.author.email}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : ''}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
