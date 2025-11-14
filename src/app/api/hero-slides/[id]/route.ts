import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth/helpers'
import { deleteImage } from '@/lib/storage'

// GET /api/hero-slides/[id] - Get single hero slide
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const heroSlide = await prisma.heroSlide.findUnique({
      where: { id }
    })

    if (!heroSlide) {
      return NextResponse.json(
        { error: 'Hero slide not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(heroSlide)
  } catch (error) {
    console.error('Error fetching hero slide:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero slide' },
      { status: 500 }
    )
  }
}

// PUT /api/hero-slides/[id] - Update hero slide (admin only)
export async function PUT(
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
    const body = await request.json()
    const { title, content, image, linkUrl, bgColor, isActive, order } = body

    // Get current slide to check if image is changing
    const currentSlide = await prisma.heroSlide.findUnique({
      where: { id },
      select: { image: true }
    })

    // If image is changing and old image exists, delete it
    if (currentSlide?.image && image && currentSlide.image !== image) {
      try {
        await deleteImage(currentSlide.image)
      } catch (error) {
        console.error('Error deleting old image:', error)
      }
    }

    const heroSlide = await prisma.heroSlide.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(image !== undefined && { image }),
        ...(linkUrl !== undefined && { linkUrl }),
        ...(bgColor !== undefined && { bgColor }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order })
      }
    })

    return NextResponse.json(heroSlide)
  } catch (error) {
    console.error('Error updating hero slide:', error)
    return NextResponse.json(
      { error: 'Failed to update hero slide' },
      { status: 500 }
    )
  }
}

// DELETE /api/hero-slides/[id] - Delete hero slide (admin only)
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

    // Get slide to delete image if exists
    const slide = await prisma.heroSlide.findUnique({
      where: { id },
      select: { image: true }
    })

    await prisma.heroSlide.delete({
      where: { id }
    })

    // Delete image from storage
    if (slide?.image) {
      try {
        await deleteImage(slide.image)
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }

    return NextResponse.json({ message: 'Hero slide deleted successfully' })
  } catch (error) {
    console.error('Error deleting hero slide:', error)
    return NextResponse.json(
      { error: 'Failed to delete hero slide' },
      { status: 500 }
    )
  }
}
