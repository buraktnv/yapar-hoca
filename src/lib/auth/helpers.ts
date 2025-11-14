import { createClient } from '../supabase/server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

export async function getUserRole() {
  const user = await getUser()

  if (!user) {
    return null
  }

  // Get user role from Prisma database
  const prisma = (await import('../prisma')).default
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, isActive: true }
  })

  return dbUser
}

export async function requireAdmin() {
  const user = await requireAuth()
  const userRole = await getUserRole()

  if (!userRole || userRole.role !== 'ADMIN' || !userRole.isActive) {
    redirect('/student')
  }

  return user
}

export async function isAdmin(userId: string): Promise<boolean> {
  const prisma = (await import('../prisma')).default
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, isActive: true }
  })

  return user?.role === 'ADMIN' && user.isActive
}
