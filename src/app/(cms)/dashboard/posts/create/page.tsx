import { requireAuth } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import PostForm from '@/components/dashboard/PostForm'

export const metadata = {
  title: 'Create Post | Dashboard',
  description: 'Create a new blog post',
}

export default async function CreatePostPage() {
  const user = await requireAuth()

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Yeni Blog Yazısı</h1>
        <p className="mt-2 text-gray-600">
          Yeni bir blog yazısı oluşturun
        </p>
      </div>
      <PostForm categories={categories} authorId={user.id} />
    </div>
  )
}
