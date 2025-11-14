import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth/helpers'

// PUT /api/featured-posts/reorder - Reorder featured posts (admin only)
export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { items } = body // Array of { id, order }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be an array' },
        { status: 400 }
      )
    }

    // Update all items with new order
    await Promise.all(
      items.map(({ id, order }) =>
        prisma.featuredPost.update({
          where: { id },
          data: { order }
        })
      )
    )

    const updatedPosts = await prisma.featuredPost.findMany({
      include: {
        post: {
          include: {
            author: {
              select: { name: true, email: true }
            },
            categories: true
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(updatedPosts)
  } catch (error) {
    console.error('Error reordering featured posts:', error)
    return NextResponse.json(
      { error: 'Failed to reorder featured posts' },
      { status: 500 }
    )
  }
}
