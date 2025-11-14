'use client'

import { useState } from 'react'
import CategoryNav from '@/components/navbar/CategoryNav'
import CategorySidebar from '@/components/navbar/CategorySidebar'

interface CategoryWithChildren {
  id: string
  name: string
  slug: string
  children: CategoryWithChildren[]
}

interface User {
  id: string
  email: string
  name: string | null
  role: 'ADMIN' | 'USER'
}

interface SiteLayoutClientProps {
  categories: CategoryWithChildren[]
  user: User | null
  children: React.ReactNode
}

export default function SiteLayoutClient({ categories, user, children }: SiteLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <CategoryNav
        user={user}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex min-h-[calc(100vh-64px)]">
        <CategorySidebar
          categories={categories}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1">
          {children}
        </main>
      </div>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} YaparHoca. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </>
  )
}
