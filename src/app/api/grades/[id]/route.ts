import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser, isAdmin } from '@/lib/auth/helpers'

// GET /api/grades/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const grade = await prisma.grade.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        createdBy: { select: { name: true } }
      }
    })

    if (!grade) {
      return NextResponse.json({ error: 'Grade not found' }, { status: 404 })
    }

    // Check permission: student can only see their own grades
    const userIsAdmin = await isAdmin(user.id)
    if (!userIsAdmin && grade.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(grade)
  } catch (error) {
    console.error('Error fetching grade:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/grades/[id] - Update grade (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userIsAdmin = await isAdmin(user.id)
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { testName, subject, score, maxScore, date } = body

    if (!testName || !subject || score === undefined || !maxScore || !date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const grade = await prisma.grade.update({
      where: { id },
      data: {
        testName,
        subject,
        score: parseFloat(score),
        maxScore: parseFloat(maxScore),
        date: new Date(date)
      },
      include: {
        user: { select: { name: true, email: true } },
        createdBy: { select: { name: true } }
      }
    })

    return NextResponse.json(grade)
  } catch (error) {
    console.error('Error updating grade:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/grades/[id] - Delete grade (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userIsAdmin = await isAdmin(user.id)
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 })
    }

    const { id } = await params
    await prisma.grade.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting grade:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
