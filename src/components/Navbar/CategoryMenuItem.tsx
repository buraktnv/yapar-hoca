'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryWithChildren {
  id: string
  name: string
  slug: string
  children: CategoryWithChildren[]
}

interface CategoryMenuItemProps {
  category: CategoryWithChildren
  level?: number
}

export default function CategoryMenuItem({ category, level = 0 }: CategoryMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const hasChildren = category.children && category.children.length > 0

  return (
    <div
      className="relative overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/category/${category.slug}`}
        className={cn(
          'flex items-center justify-between py-2 px-4 hover:bg-gray-100 transition-colors',
          level > 0 && 'text-sm'
        )}
      >
        <span className="text-gray-700 hover:text-gray-900">
          {category.name}
        </span>
        {hasChildren && (
          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
        )}
      </Link>

      {/* Submenu that appears on hover to the right - controlled by state */}
      {hasChildren && isHovered && (
        <div
          className={cn(
            "absolute left-full top-[-9px] min-w-[16rem] bg-white border border-gray-200",
            // Increase z-index for each level to ensure proper stacking
            level === 0 && "z-50",
            level === 1 && "z-[51]",
            level === 2 && "z-[52]",
            level >= 3 && "z-[53]"
          )}
        >
          <div className="py-2">
            {category.children.map((child) => (
              <CategoryMenuItem
                key={child.id}
                category={child}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
