"use client"

import Link from 'next/link'
import { Menu, User, LogOut, LayoutDashboard, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/auth/actions'

interface User {
  id: string
  email: string
  name: string | null
  role: 'ADMIN' | 'USER'
}

interface CategoryNavProps {
  user: User | null
  onMenuToggle: () => void
}

export default function CategoryNav({ user, onMenuToggle }: CategoryNavProps) {
  async function handleSignOut() {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuToggle}
              className="mr-3 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 md:hidden"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">YaparHoca</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="hidden md:block text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Ana Sayfa
            </Link>

            {/* User Menu / Login Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">Hesabım</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name || 'Kullanıcı'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {user.role === 'ADMIN' ? (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/student" className="flex items-center cursor-pointer">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          Notlarım
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/student/grades" className="flex items-center cursor-pointer">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          Sınavlarım
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button>Giriş Yap</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
