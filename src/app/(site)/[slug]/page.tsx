import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getCategoryBreadcrumbs } from '@/lib/categoryHelpers'
import BlogContent from '@/components/blog/BlogContent'
import PostQuizzes from '@/components/blog/PostQuizzes'

type Props = {
  params: Promise<{ slug: string }>
}

// Helper function to get category path
async function getCategoryPath(categoryId: string): Promise<string> {
  const breadcrumbs = await getCategoryBreadcrumbs(categoryId)
  return breadcrumbs.map(b => b.name).join(' > ')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      categories: true,
    },
  })

  if (!post) {
    return {
      title: 'Yazı Bulunamadı | YaparHoca',
    }
  }

  return {
    title: `${post.title} | YaparHoca`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: ['YaparHoca'],
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      categories: true,
      quizzes: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' }
      }
    },
  })

  if (!post) {
    notFound()
  }

  // Get category paths
  const categoriesWithPaths = await Promise.all(
    post.categories.map(async (cat) => ({
      ...cat,
      path: await getCategoryPath(cat.id)
    }))
  )

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-8">
        {post.featuredImage && (
          <div className="aspect-video relative overflow-hidden rounded-lg mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {categoriesWithPaths.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer text-xs">
                {category.path}
              </Badge>
            </Link>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-4">{post.excerpt}</p>
        )}

        <div className="flex items-center text-gray-500 text-sm">
          <span>{post.author.name || post.author.email}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : ''}
          </time>
        </div>
      </header>

      {/* Content */}
      <BlogContent content={post.content} />

      {/* Quizzes */}
      <PostQuizzes quizzes={post.quizzes} />

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Tüm yazılara dön
        </Link>
      </footer>
    </article>
  )
}
