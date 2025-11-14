import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import UsersTable from '@/components/dashboard/UsersTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const metadata = {
  title: 'Users | Dashboard',
  description: 'Manage users',
}

export default async function UsersPage() {
  await requireAdmin()

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcılar</h1>
          <p className="mt-2 text-gray-600">
            Sistem kullanıcılarını yönetin
          </p>
        </div>
        <Link href="/dashboard/users/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Kullanıcı
          </Button>
        </Link>
      </div>

      <UsersTable users={users} />
    </div>
  )
}