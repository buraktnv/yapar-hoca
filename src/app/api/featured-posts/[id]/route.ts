import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth/helpers'

// DELETE /api/featured-posts/[id] - Remove post from featured (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (dbUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    await prisma.featuredPost.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Featured post removed successfully' })
  } catch (error) {
    console.error('Error deleting featured post:', error)
    return NextResponse.json(
      { error: 'Failed to delete featured post' },
      { status: 500 }
    )
  }
}
