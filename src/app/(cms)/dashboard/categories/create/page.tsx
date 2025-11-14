import { requireAuth } from '@/lib/auth/helpers'
import CategoryForm from '@/components/dashboard/CategoryForm'
import { getCategoryTree, flattenCategoryTree } from '@/lib/categoryHelpers'

export const metadata = {
  title: 'Create Category | Dashboard',
  description: 'Create a new category',
}

export default async function CreateCategoryPage() {
  await requireAuth()

  // Fetch all existing categories for the parent selector
  const categoryTree = await getCategoryTree()
  const flatCategories = flattenCategoryTree(categoryTree)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Yeni Kategori</h1>
        <p className="mt-2 text-gray-600">
          Blog için yeni bir kategori oluşturun
        </p>
      </div>
      <CategoryForm categories={flatCategories} />
    </div>
  )
}
