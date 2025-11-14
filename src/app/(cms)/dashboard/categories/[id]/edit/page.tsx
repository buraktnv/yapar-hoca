import { requireAuth } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CategoryForm from '@/components/dashboard/CategoryForm'
import { getCategoryTree, flattenCategoryTree, getCategoryDescendants } from '@/lib/categoryHelpers'

export const metadata = {
  title: 'Edit Category | Dashboard',
  description: 'Edit category',
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAuth()
  const { id } = await params

  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) {
    notFound()
  }

  // Fetch all categories for the parent selector
  const categoryTree = await getCategoryTree()
  const flatCategories = flattenCategoryTree(categoryTree)

  // Get descendants to exclude them from parent options (prevent circular references)
  const descendants = await getCategoryDescendants(id)

  // Filter out current category and its descendants
  const availableCategories = flatCategories.filter(
    cat => cat.id !== id && !descendants.includes(cat.id)
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kategoriyi Düzenle</h1>
        <p className="mt-2 text-gray-600">
          {category.name} kategorisini düzenleyin
        </p>
      </div>
      <CategoryForm category={category} categories={availableCategories} />
    </div>
  )
}
