import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth/helpers'

// GET /api/featured-posts - Get all featured posts with full post data
export async function GET(request: NextRequest) {
  try {
    const featuredPosts = await prisma.featuredPost.findMany({
      include: {
        post: {
          include: {
            author: {
              select: { name: true, email: true }
            },
            categories: {
              select: { id: true, name: true, slug: true }
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    // Only return published posts for non-admin users
    const user = await getUser()
    const isAdmin = user && (await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    }))?.role === 'ADMIN'

    const filtered = isAdmin
      ? featuredPosts
      : featuredPosts.filter(fp => fp.post.published)

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured posts' },
      { status: 500 }
    )
  }
}

// POST /api/featured-posts - Add post to featured (admin only)
export async function POST(request: NextRequest) {
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
    const { postId, order } = body

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if already featured
    const existing = await prisma.featuredPost.findFirst({
      where: { postId }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Post is already featured' },
        { status: 400 }
      )
    }

    const featuredPost = await prisma.featuredPost.create({
      data: {
        postId,
        order: order ?? 0
      },
      include: {
        post: {
          include: {
            author: {
              select: { name: true, email: true }
            },
            categories: true
          }
        }
      }
    })

    return NextResponse.json(featuredPost, { status: 201 })
  } catch (error) {
    console.error('Error creating featured post:', error)
    return NextResponse.json(
      { error: 'Failed to create featured post' },
      { status: 500 }
    )
  }
}
