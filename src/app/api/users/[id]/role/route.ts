import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth/helpers'

// PATCH /api/users/[id]/role - Change user role (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if current user is admin
    const currentUserData = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { role: true },
    })

    if (currentUserData?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { role } = body

    if (role !== 'ADMIN' && role !== 'USER') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Don't allow removing your own admin role
    if (id === currentUser.id && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Cannot remove your own admin role' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
