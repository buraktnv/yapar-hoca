'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, FolderOpen, Users, GraduationCap, Settings, Bell, Image, LayoutGrid, Star, HelpCircle, Gamepad2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Blog Yazıları', href: '/dashboard/posts', icon: FileText },
  { name: 'Kategoriler', href: '/dashboard/categories', icon: FolderOpen },
  { name: 'Oyunlar', href: '/dashboard/games', icon: Gamepad2 },
  { name: 'Quizler', href: '/dashboard/quizzes', icon: HelpCircle },
  { name: 'Bildirimler', href: '/dashboard/notifications', icon: Bell },
  { name: 'Ana Slider', href: '/dashboard/hero-slides', icon: Image },
  { name: 'Bannerlar', href: '/dashboard/banners', icon: LayoutGrid },
  { name: 'Öne Çıkan Yazılar', href: '/dashboard/featured-posts', icon: Star },
  { name: 'Kullanıcılar', href: '/dashboard/users', icon: Users, adminOnly: true },
  { name: 'Öğrenciler', href: '/dashboard/students', icon: GraduationCap, adminOnly: true },
  { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <Link href="/dashboard" className="text-white text-xl font-bold">
              YaparHoca CMS
            </Link>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-6 w-6',
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
