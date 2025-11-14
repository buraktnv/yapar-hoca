import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth/helpers'

// GET /api/banners - Get all banners (public: only active, admin: all)
export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    const isAdmin = user && (await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    }))?.role === 'ADMIN'

    const banners = await prisma.banner.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(banners)
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

// POST /api/banners - Create banner (admin only)
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
    const { title, content, image, linkUrl, isClickable, layout, isActive, order } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        content,
        image,
        linkUrl,
        isClickable: isClickable ?? false,
        layout: layout || 'slider',
        isActive: isActive ?? true,
        order: order ?? 0
      }
    })

    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    )
  }
}
