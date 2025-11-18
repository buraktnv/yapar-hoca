'use client'

import { X } from 'lucide-react'
import CategoryMenuItem from './CategoryMenuItem'
import { cn } from '@/lib/utils'

interface CategoryWithChildren {
  id: string
  name: string
  slug: string
  children: CategoryWithChildren[]
}

interface CategorySidebarProps {
  categories: CategoryWithChildren[]
  isOpen: boolean
  onClose: () => void
}

export default function CategorySidebar({ categories, isOpen, onClose }: CategorySidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-gray-50 border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out overflow-visible',
          'md:sticky md:top-0 md:translate-x-0 md:z-50',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
          <h2 className="font-bold text-gray-900">Kategoriler</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Kategoriler</h2>
        </div>

        {/* Categories List */}
        <nav className="overflow-visible h-[calc(100vh-64px)] py-2">
          {categories.length === 0 ? (
            <p className="text-gray-500 text-sm px-4 py-2">Henüz kategori yok</p>
          ) : (
            categories.map((category) => (
              <CategoryMenuItem key={category.id} category={category} />
            ))
          )}
        </nav>
      </aside>
    </>
  )
}
