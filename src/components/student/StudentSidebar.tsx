'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, FileText, Award, LogOut, BookOpen, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth/actions'

interface StudentSidebarProps {
  user: {
    name: string | null
    email: string | null
  }
}

export default function StudentSidebar({ user }: StudentSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { href: '/student', label: 'Ana Sayfa', icon: Home },
    { href: '/student/notes', label: 'Notlarım', icon: FileText },
    { href: '/student/grades', label: 'Sınav Sonuçları', icon: Award },
    { href: '/student/quizzes', label: 'Quizlerim', icon: HelpCircle },
    { href: '/', label: 'Blog', icon: BookOpen },
  ]

  async function handleSignOut() {
    await signOut()
  }

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Öğrenci Portalı</h1>
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-900">{user.name || 'Öğrenci'}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <form action={handleSignOut}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Çıkış Yap
          </Button>
        </form>
      </div>
    </aside>
  )
}
