import prisma from './prisma'

export interface CategoryWithChildren {
  id: string
  name: string
  slug: string
  description: string | null
  order: number
  parentId: string | null
  children: CategoryWithChildren[]
  _count?: {
    posts: number
  }
}

// Get all categories with their full hierarchy
export async function getCategoryTree(): Promise<CategoryWithChildren[]> {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    },
    orderBy: { order: 'asc' }
  })

  // Build tree structure
  const categoryMap = new Map<string, CategoryWithChildren>()
  const roots: CategoryWithChildren[] = []

  // First pass: create map of all categories
  categories.forEach(cat => {
    categoryMap.set(cat.id, {
      ...cat,
      children: []
    })
  })

  // Second pass: build tree
  categories.forEach(cat => {
    const category = categoryMap.get(cat.id)!

    if (cat.parentId) {
      const parent = categoryMap.get(cat.parentId)
      if (parent) {
        parent.children.push(category)
      } else {
        // Parent doesn't exist, treat as root
        roots.push(category)
      }
    } else {
      // No parent, this is a root category
      roots.push(category)
    }
  })

  // Sort children by order for each category
  const sortChildren = (cats: CategoryWithChildren[]) => {
    cats.sort((a, b) => a.order - b.order)
    cats.forEach(cat => {
      if (cat.children.length > 0) {
        sortChildren(cat.children)
      }
    })
  }
  sortChildren(roots)

  return roots
}

// Get all ancestor categories for a given category
export async function getCategoryAncestors(categoryId: string): Promise<CategoryWithChildren[]> {
  const ancestors: CategoryWithChildren[] = []
  let currentId: string | null = categoryId

  while (currentId) {
    const category = await prisma.category.findUnique({
      where: { id: currentId }
    })

    if (!category) break

    ancestors.unshift({
      ...category,
      children: []
    })

    currentId = category.parentId
  }

  return ancestors
}

// Get breadcrumb path for a category
export async function getCategoryBreadcrumbs(categoryId: string): Promise<{ id: string; name: string; slug: string }[]> {
  const ancestors = await getCategoryAncestors(categoryId)
  return ancestors.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug
  }))
}

// Get all descendant categories (children, grandchildren, etc.)
export async function getCategoryDescendants(categoryId: string): Promise<string[]> {
  const descendants: string[] = []

  async function collectDescendants(id: string) {
    const children = await prisma.category.findMany({
      where: { parentId: id },
      select: { id: true }
    })

    for (const child of children) {
      descendants.push(child.id)
      await collectDescendants(child.id)
    }
  }

  await collectDescendants(categoryId)
  return descendants
}

// Validate that a category can be moved to a new parent (prevent circular references)
export async function canMoveCategory(categoryId: string, newParentId: string | null): Promise<boolean> {
  if (!newParentId) return true // Moving to root is always allowed
  if (categoryId === newParentId) return false // Can't be parent of itself

  // Check if newParent is a descendant of category (would create cycle)
  const descendants = await getCategoryDescendants(categoryId)
  return !descendants.includes(newParentId)
}

// Flatten category tree for select/dropdown components
export function flattenCategoryTree(
  categories: CategoryWithChildren[],
  level = 0,
  prefix = ''
): Array<{ id: string; name: string; slug: string; level: number; displayName: string }> {
  const flattened: Array<{ id: string; name: string; slug: string; level: number; displayName: string }> = []

  categories.forEach(cat => {
    const indent = '  '.repeat(level)
    const displayName = level > 0 ? `${indent}└─ ${cat.name}` : cat.name

    flattened.push({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      level,
      displayName
    })

    if (cat.children.length > 0) {
      flattened.push(...flattenCategoryTree(cat.children, level + 1, prefix))
    }
  })

  return flattened
}

// Get categories formatted for navigation menu (nested structure)
export async function getCategoryNav() {
  return getCategoryTree()
}
