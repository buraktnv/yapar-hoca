import { requireAuth } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import CategoriesTable from '@/components/dashboard/CategoriesTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getCategoryTree, flattenCategoryTree } from '@/lib/categoryHelpers'

export const metadata = {
  title: 'Categories | Dashboard',
  description: 'Manage blog categories',
}

export default async function CategoriesPage() {
  await requireAuth()

  // Get categories with hierarchy
  const categoryTree = await getCategoryTree()
  const flatCategories = flattenCategoryTree(categoryTree)

  // Get post counts for each category
  const categoriesWithCounts = await Promise.all(
    flatCategories.map(async (cat) => {
      const postCount = await prisma.post.count({
        where: {
          categories: {
            some: { id: cat.id }
          }
        }
      })
      return {
        ...cat,
        _count: { posts: postCount }
      }
    })
  )

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kategoriler</h1>
          <p className="mt-2 text-gray-600">
            Blog kategorilerini yönetin. Hiyerarşik yapı desteklenir.
          </p>
        </div>
        <Link href="/dashboard/categories/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Kategori
          </Button>
        </Link>
      </div>

      <CategoriesTable categories={categoriesWithCounts} />
    </div>
  )
}
