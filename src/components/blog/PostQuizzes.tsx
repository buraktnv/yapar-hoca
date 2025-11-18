'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import dynamic from 'next/dynamic'

const QuizEmbed = dynamic(() => import('@/components/quiz/QuizEmbed'), {
  ssr: false,
  loading: () => (
    <div className="my-8 p-8 bg-gray-100 rounded-lg text-center">
      <p className="text-gray-500">Quiz yükleniyor...</p>
    </div>
  )
})

interface Quiz {
  id: string
  title: string
  description: string | null
}

interface PostQuizzesProps {
  quizzes: Quiz[]
}

export default function PostQuizzes({ quizzes }: PostQuizzesProps) {
  const [expandedQuizzes, setExpandedQuizzes] = useState<Set<string>>(new Set())

  if (quizzes.length === 0) {
    return null
  }

  const toggleQuiz = (quizId: string) => {
    const newExpanded = new Set(expandedQuizzes)
    if (newExpanded.has(quizId)) {
      newExpanded.delete(quizId)
    } else {
      newExpanded.add(quizId)
    }
    setExpandedQuizzes(newExpanded)
  }

  return (
    <div className="my-12 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          {quizzes.length === 1 ? 'İlişkili Quiz' : 'İlişkili Quizler'}
        </h2>
      </div>

      {quizzes.map((quiz) => {
        const isExpanded = expandedQuizzes.has(quiz.id)

        return (
          <Card key={quiz.id} className="overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {quiz.title}
                  </h3>
                  {quiz.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {quiz.description}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => toggleQuiz(quiz.id)}
                  variant="outline"
                  className="ml-4 flex items-center gap-2"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Gizle
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Quiz&apos;e Başla
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="p-6">
                <QuizEmbed quizId={quiz.id} />
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
