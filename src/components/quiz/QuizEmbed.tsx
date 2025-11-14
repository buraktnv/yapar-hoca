'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Trophy } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK'
  options: string[]
  correctAnswer: string
  order: number
  points: number
}

interface Quiz {
  id: string
  title: string
  description: string | null
  showAnswers: boolean
  questions: QuizQuestion[]
}

interface QuizEmbedProps {
  quizId: string
}

export default function QuizEmbed({ quizId }: QuizEmbedProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`)
      if (!response.ok) {
        throw new Error('Quiz bulunamadı')
      }
      const data = await response.json()
      setQuiz(data)
    } catch (error) {
      console.error('Error fetching quiz:', error)
      toast.error('Quiz yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!quiz) return

    // Check if all questions are answered
    const unanswered = quiz.questions.filter(q => !answers[q.id])
    if (unanswered.length > 0) {
      toast.error('Lütfen tüm soruları cevaplayın')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      })

      if (!response.ok) {
        throw new Error('Gönderim başarısız')
      }

      const data = await response.json()
      setResults(data)
      setSubmitted(true)
      toast.success('Quiz tamamlandı!')
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Quiz gönderilemedi')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setAnswers({})
    setSubmitted(false)
    setResults(null)
  }

  if (loading) {
    return (
      <Card className="my-8">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Quiz yükleniyor...</p>
        </CardContent>
      </Card>
    )
  }

  if (!quiz) {
    return (
      <Card className="my-8">
        <CardContent className="p-8 text-center">
          <p className="text-red-500">Quiz bulunamadı</p>
        </CardContent>
      </Card>
    )
  }

  if (submitted && results) {
    const percentage = results.percentage.toFixed(0)
    const isPassing = percentage >= 70

    return (
      <Card className="my-8 border-2 border-blue-200">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100">
          <Trophy className={`h-12 w-12 mx-auto mb-3 ${isPassing ? 'text-green-600' : 'text-orange-600'}`} />
          <CardTitle className="text-2xl">Quiz Tamamlandı!</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2">
              {results.score} / {results.maxScore}
            </div>
            <div className="text-2xl text-gray-600">
              {percentage}%
            </div>
            <p className="text-gray-500 mt-2">
              {isPassing ? 'Tebrikler! Başarıyla tamamladınız.' : 'Tekrar denemek ister misiniz?'}
            </p>
          </div>

          {quiz.showAnswers && (
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg">Cevaplarınız:</h3>
              {quiz.questions.map((question) => {
                const result = results.results[question.id]
                const userAnswer = answers[question.id]

                return (
                  <div key={question.id} className={`p-4 rounded-lg border-2 ${result.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-start gap-2 mb-2">
                      {result.correct ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm mt-1">
                          <span className="font-semibold">Cevabınız:</span> {userAnswer}
                        </p>
                        {!result.correct && result.correctAnswer && (
                          <p className="text-sm mt-1 text-green-700">
                            <span className="font-semibold">Doğru cevap:</span> {result.correctAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex justify-center">
            <Button onClick={handleReset} variant="outline">
              Tekrar Dene
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="my-8 border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="text-2xl">{quiz.title}</CardTitle>
        {quiz.description && (
          <p className="text-gray-600 mt-2">{quiz.description}</p>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
              <Label className="text-base font-semibold mb-3 block">
                {index + 1}. {question.question}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({question.points} puan)
                </span>
              </Label>

              {question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE' ? (
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                  className="space-y-2"
                >
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                      <Label
                        htmlFor={`${question.id}-${optIndex}`}
                        className="cursor-pointer font-normal"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <Input
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Cevabınızı yazın"
                  className="mt-2"
                />
              )}
            </div>
          ))}

          <div className="flex justify-center pt-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Gönderiliyor...' : 'Quiz\'i Tamamla'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
