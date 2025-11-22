'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Folder } from 'lucide-react'
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
  isCollapsed?: boolean
}

export default function CategoryMenuItem({ category, level = 0, isCollapsed = false }: CategoryMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const hasChildren = category.children && category.children.length > 0

  // When collapsed (at root level), show only icon
  if (isCollapsed && level === 0) {
    return (
      <div
        className="relative overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={`/category/${category.slug}`}
          className="flex items-center justify-center py-3 px-2 hover:bg-gray-100 transition-colors"
          title={category.name}
        >
          <Folder className="h-5 w-5 text-gray-600" />
        </Link>

        {/* Expanded menu on hover when collapsed */}
        {isHovered && (
          <div className="absolute left-full top-0 min-w-[16rem] bg-white border border-gray-200 shadow-lg z-50">
            <div className="py-2">
              <Link
                href={`/category/${category.slug}`}
                className="flex items-center justify-between py-2 px-4 hover:bg-gray-100 transition-colors font-medium"
              >
                <span className="text-gray-700 hover:text-gray-900">
                  {category.name}
                </span>
                {hasChildren && (
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
              </Link>
              {hasChildren && (
                <div className="border-t border-gray-100 mt-1 pt-1">
                  {category.children.map((child) => (
                    <CategoryMenuItem
                      key={child.id}
                      category={child}
                      level={1}
                      isCollapsed={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

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
            "absolute left-full top-[-9px] min-w-[16rem] bg-white border border-gray-200 shadow-lg",
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
                isCollapsed={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
