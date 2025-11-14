import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser, isAdmin } from '@/lib/auth/helpers'

// GET /api/notes - Get notes (students get their own, admins get all or by userId)
export async function GET(req: Request) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userIsAdmin = await isAdmin(user.id)
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    let notes

    if (userIsAdmin && userId) {
      // Admin requesting specific student's notes
      notes = await prisma.note.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          createdBy: { select: { name: true } }
        }
      })
    } else if (userIsAdmin) {
      // Admin requesting all notes
      notes = await prisma.note.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          createdBy: { select: { name: true } }
        }
      })
    } else {
      // Student requesting their own notes
      notes = await prisma.note.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { name: true } }
        }
      })
    }

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/notes - Create note (admin only)
export async function POST(req: Request) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userIsAdmin = await isAdmin(user.id)
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 })
    }

    const body = await req.json()
    const { title, content, userId } = body

    if (!title || !content || !userId) {
      return NextResponse.json(
        { error: 'Title, content, and userId are required' },
        { status: 400 }
      )
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
        createdById: user.id
      },
      include: {
        user: { select: { name: true, email: true } },
        createdBy: { select: { name: true } }
      }
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
