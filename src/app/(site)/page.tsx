import prisma from '@/lib/prisma'
import NotificationBanner from '@/components/homepage/NotificationBanner'
import HeroCarousel from '@/components/homepage/HeroCarousel'
import BannersSection from '@/components/homepage/BannersSection'
import FeaturedPostsCarousel from '@/components/homepage/FeaturedPostsCarousel'
import RecentPostsCarousel from '@/components/homepage/RecentPostsCarousel'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'YaparHoca | Eğitim Blogu',
  description: 'Matematik ve eğitim konularında blog yazıları',
}

export default async function HomePage() {
  const now = new Date()

  // Fetch active notifications
  const notifications = await prisma.notification.findMany({
    where: {
      isActive: true,
      OR: [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: null },
        { startDate: null, endDate: { gte: now } },
        { startDate: { lte: now }, endDate: { gte: now } }
      ]
    },
    orderBy: { order: 'asc' }
  })

  // Fetch active hero slides
  const heroSlides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  })

  // Fetch active banners
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  })

  // Fetch featured posts
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

  // Fetch recent posts
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true, email: true }
      },
      categories: {
        select: { id: true, name: true, slug: true }
      }
    },
    orderBy: { publishedAt: 'desc' },
    take: 8
  })

  return (
    <div className="min-h-screen">
      {/* Notifications Banner */}
      {notifications.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 pt-6">
          <div className="max-w-7xl mx-auto">
            <NotificationBanner notifications={notifications} />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              YaparHoca
            </h1>
            <p className="text-xl text-gray-600">
              Matematik ve eğitim dünyasından en son yazılar
            </p>
          </div>

          {/* Hero Carousel */}
          {heroSlides.length > 0 && (
            <div className="mb-12">
              <HeroCarousel slides={heroSlides} />
            </div>
          )}

          {/* Banners Section */}
          {banners.length > 0 && (
            <div className="mb-12">
              <BannersSection banners={banners} />
            </div>
          )}

          {/* Featured Posts Carousel */}
          {featuredPosts.length > 0 && (
            <div className="mb-12">
              <FeaturedPostsCarousel featuredPosts={featuredPosts} />
            </div>
          )}

          {/* Recent Posts Carousel */}
          {recentPosts.length > 0 && (
            <div className="mb-12">
              <RecentPostsCarousel posts={recentPosts} />
            </div>
          )}

          {/* Empty State */}
          {recentPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Henüz yayınlanmış yazı bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
