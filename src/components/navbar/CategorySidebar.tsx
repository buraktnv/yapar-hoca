'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Menu } from 'lucide-react'
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
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved))
    }
    setIsLoaded(true)
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
  }

  // Determine if sidebar should show expanded content
  const showExpanded = !isCollapsed || isHovering

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
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          'fixed top-0 left-0 h-full bg-gray-50 border-r border-gray-200 z-50 transition-all duration-300 ease-in-out overflow-visible',
          'md:sticky md:top-0 md:translate-x-0 md:z-50',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop width based on collapsed state and hover
          isLoaded && showExpanded ? 'md:w-64' : isLoaded ? 'md:w-16' : 'md:w-64',
          // Mobile always full width
          'w-64'
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
        <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-200">
          {showExpanded ? (
            <h2 className="font-bold text-gray-900 whitespace-nowrap">Kategoriler</h2>
          ) : (
            <Menu className="h-5 w-5 text-gray-600 mx-auto" />
          )}
          <button
            onClick={toggleCollapse}
            className={cn(
              'p-1 hover:bg-gray-200 rounded-md transition-colors',
              !showExpanded && 'hidden'
            )}
            title={isCollapsed ? 'Genişlet' : 'Daralt'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Categories List */}
        <nav className="overflow-visible h-[calc(100vh-64px)] py-2">
          {categories.length === 0 ? (
            <p className={cn(
              'text-gray-500 text-sm px-4 py-2',
              !showExpanded && 'md:hidden'
            )}>
              Henüz kategori yok
            </p>
          ) : (
            categories.map((category) => (
              <CategoryMenuItem
                key={category.id}
                category={category}
                isCollapsed={!showExpanded}
              />
            ))
          )}
        </nav>
      </aside>
    </>
  )
}
