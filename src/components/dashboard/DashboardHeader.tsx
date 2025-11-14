import { getUser } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import UserMenu from './UserMenu'

export default async function DashboardHeader() {
  const authUser = await getUser()

  if (!authUser) {
    return null
  }

  // Fetch full user data from database including name
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  })

  if (!user) {
    return null
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <UserMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}
