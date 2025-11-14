import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth/helpers'

// GET /api/hero-slides - Get all hero slides (public: only active, admin: all)
export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    const isAdmin = user && (await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    }))?.role === 'ADMIN'

    const heroSlides = await prisma.heroSlide.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(heroSlides)
  } catch (error) {
    console.error('Error fetching hero slides:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero slides' },
      { status: 500 }
    )
  }
}

// POST /api/hero-slides - Create hero slide (admin only)
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
    const { title, content, image, linkUrl, bgColor, isActive, order } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const heroSlide = await prisma.heroSlide.create({
      data: {
        title,
        content,
        image,
        linkUrl,
        bgColor,
        isActive: isActive ?? true,
        order: order ?? 0
      }
    })

    return NextResponse.json(heroSlide, { status: 201 })
  } catch (error) {
    console.error('Error creating hero slide:', error)
    return NextResponse.json(
      { error: 'Failed to create hero slide' },
      { status: 500 }
    )
  }
}
