import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import FeaturedPostsManager from '@/components/dashboard/FeaturedPostsManager'

export default async function FeaturedPostsPage() {
  await requireAdmin()

  // Get featured posts with full post data
  const featuredPosts = await prisma.featuredPost.findMany({
    include: {
      post: {
        include: {
          author: {
            select: { name: true, email: true }
          },
          categories: {
            select: { id: true, name: true, slug: true }
          }
        }
      }
    },
    orderBy: { order: 'asc' }
  })

  // Get all published posts for selection
  const allPosts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true, email: true }
      },
      categories: {
        select: { id: true, name: true }
      }
    },
    orderBy: { publishedAt: 'desc' }
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Öne Çıkan Yazılar</h1>
        <p className="text-gray-600 mt-1">
          Ana sayfada öne çıkan yazıları yönetin ve sıralayın
        </p>
      </div>

      <FeaturedPostsManager
        featuredPosts={featuredPosts}
        allPosts={allPosts}
      />
    </div>
  )
}
