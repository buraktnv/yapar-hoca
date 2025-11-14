import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth/helpers'

// POST /api/quizzes/[id]/submit - Submit quiz answers
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { answers } = body // { questionId: answer }

    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    if (!quiz.isActive) {
      return NextResponse.json({ error: 'Quiz is not active' }, { status: 400 })
    }

    // Calculate score
    let score = 0
    let maxScore = 0
    const results: Record<string, { correct: boolean; correctAnswer?: string }> = {}

    quiz.questions.forEach((question) => {
      maxScore += question.points
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer

      if (isCorrect) {
        score += question.points
      }

      results[question.id] = {
        correct: isCorrect,
        ...(quiz.showAnswers ? { correctAnswer: question.correctAnswer } : {})
      }
    })

    // Get user if logged in
    const user = await getUser()

    // Save submission if tracking is enabled
    if (quiz.trackScores) {
      await prisma.quizSubmission.create({
        data: {
          quizId: id,
          userId: user?.id || null,
          answers,
          score,
          maxScore
        }
      })
    }

    return NextResponse.json({
      score,
      maxScore,
      percentage: maxScore > 0 ? (score / maxScore) * 100 : 0,
      results
    })
  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    )
  }
}
