import { requireAuth } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import PostsTable from '@/components/dashboard/PostsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const metadata = {
  title: 'Posts | Dashboard',
  description: 'Manage blog posts',
}

export default async function PostsPage() {
  await requireAuth()

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Yazıları</h1>
          <p className="mt-2 text-gray-600">
            Tüm blog yazılarınızı yönetin
          </p>
        </div>
        <Link href="/dashboard/posts/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Yazı
          </Button>
        </Link>
      </div>

      <PostsTable posts={posts} />
    </div>
  )
}
