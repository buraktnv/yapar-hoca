import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser, isAdmin } from '@/lib/auth/helpers'

// GET /api/grades - Get grades (students get their own, admins get all or by userId)
export async function GET(req: Request) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userIsAdmin = await isAdmin(user.id)
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    let grades

    if (userIsAdmin && userId) {
      // Admin requesting specific student's grades
      grades = await prisma.grade.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          createdBy: { select: { name: true } }
        }
      })
    } else if (userIsAdmin) {
      // Admin requesting all grades
      grades = await prisma.grade.findMany({
        orderBy: { date: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          createdBy: { select: { name: true } }
        }
      })
    } else {
      // Student requesting their own grades
      grades = await prisma.grade.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        include: {
          createdBy: { select: { name: true } }
        }
      })
    }

    return NextResponse.json(grades)
  } catch (error) {
    console.error('Error fetching grades:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/grades - Create grade (admin only)
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
    const { testName, subject, score, maxScore, date, userId } = body

    if (!testName || !subject || score === undefined || !maxScore || !date || !userId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const grade = await prisma.grade.create({
      data: {
        testName,
        subject,
        score: parseFloat(score),
        maxScore: parseFloat(maxScore),
        date: new Date(date),
        userId,
        createdById: user.id
      },
      include: {
        user: { select: { name: true, email: true } },
        createdBy: { select: { name: true } }
      }
    })

    return NextResponse.json(grade, { status: 201 })
  } catch (error) {
    console.error('Error creating grade:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
