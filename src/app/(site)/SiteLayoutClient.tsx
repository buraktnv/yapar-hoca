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

interface Branding {
  siteName: string
  brandingType: 'text' | 'logo' | 'icon_text'
  brandingLogoUrl: string | null
  brandingIconUrl: string | null
}

interface SiteLayoutClientProps {
  categories: CategoryWithChildren[]
  user: User | null
  branding: Branding
  children: React.ReactNode
}

export default function SiteLayoutClient({ categories, user, branding, children }: SiteLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <CategoryNav
        user={user}
        branding={branding}
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
          <p>&copy; {new Date().getFullYear()} {branding.siteName}. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </>
  )
}
