import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth/helpers'

// GET /api/quizzes - Get all quizzes (admin sees all, public sees active only)
export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    const isAdmin = user && (await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    }))?.role === 'ADMIN'

    const quizzes = await prisma.quiz.findMany({
      where: isAdmin ? {} : { isActive: true },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        questions: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            questions: true,
            submissions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}

// POST /api/quizzes - Create a new quiz (admin only)
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
    const { title, description, postId, isActive, showAnswers, trackScores, questions } = body

    // Create quiz with questions
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description || null,
        postId: postId || null,
        isActive: isActive ?? true,
        showAnswers: showAnswers ?? false,
        trackScores: trackScores ?? true,
        questions: {
          create: questions.map((q: any, index: number) => ({
            question: q.question,
            type: q.type,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            order: index,
            points: q.points || 1
          }))
        }
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    )
  }
}
