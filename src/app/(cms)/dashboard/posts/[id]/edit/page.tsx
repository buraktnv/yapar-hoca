import { requireAuth } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PostForm from '@/components/dashboard/PostForm'

export const metadata = {
  title: 'Edit Post | Dashboard',
  description: 'Edit blog post',
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth()
  const { id } = await params

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Yazıyı Düzenle</h1>
        <p className="mt-2 text-gray-600">
          {post.title}
        </p>
      </div>
      <PostForm categories={categories} authorId={user.id} post={post} />
    </div>
  )
}
