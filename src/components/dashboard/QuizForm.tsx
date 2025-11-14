'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
}

interface Question {
  id?: string
  question: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK'
  options: string[]
  correctAnswer: string
  points: number
  order: number
}

interface Quiz {
  id: string
  title: string
  description: string | null
  postId: string | null
  isActive: boolean
  showAnswers: boolean
  trackScores: boolean
  questions: Question[]
}

interface QuizFormProps {
  quiz?: Quiz
  posts: Post[]
}

const emptyQuestion: Question = {
  question: '',
  type: 'MULTIPLE_CHOICE',
  options: ['', '', '', ''],
  correctAnswer: '',
  points: 1,
  order: 0
}

export default function QuizForm({ quiz, posts }: QuizFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState(quiz?.title || '')
  const [description, setDescription] = useState(quiz?.description || '')
  const [postId, setPostId] = useState(quiz?.postId || 'none')
  const [isActive, setIsActive] = useState(quiz?.isActive ?? true)
  const [showAnswers, setShowAnswers] = useState(quiz?.showAnswers ?? false)
  const [trackScores, setTrackScores] = useState(quiz?.trackScores ?? true)
  const [questions, setQuestions] = useState<Question[]>(
    quiz?.questions || [{ ...emptyQuestion }]
  )

  const addQuestion = () => {
    setQuestions([...questions, { ...emptyQuestion, order: questions.length }])
  }

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      toast.error('En az bir soru olmalıdır')
      return
    }
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }

    // Auto-adjust options based on question type
    if (field === 'type') {
      if (value === 'TRUE_FALSE') {
        newQuestions[index].options = ['Doğru', 'Yanlış']
        newQuestions[index].correctAnswer = ''
      } else if (value === 'FILL_IN_BLANK') {
        newQuestions[index].options = []
      } else if (value === 'MULTIPLE_CHOICE' && newQuestions[index].options.length === 0) {
        newQuestions[index].options = ['', '', '', '']
      }
    }

    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options.push('')
    setQuestions(newQuestions)
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions]
    if (newQuestions[questionIndex].options.length <= 2) {
      toast.error('En az iki seçenek olmalıdır')
      return
    }
    newQuestions[questionIndex].options.splice(optionIndex, 1)
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Başlık gereklidir')
      return
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) {
        toast.error(`Soru ${i + 1}: Soru metni gereklidir`)
        return
      }

      if (q.type === 'MULTIPLE_CHOICE') {
        const validOptions = q.options.filter(opt => opt.trim())
        if (validOptions.length < 2) {
          toast.error(`Soru ${i + 1}: En az iki seçenek gereklidir`)
          return
        }
      }

      if (!q.correctAnswer.trim()) {
        toast.error(`Soru ${i + 1}: Doğru cevap gereklidir`)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const url = quiz ? `/api/quizzes/${quiz.id}` : '/api/quizzes'

      const response = await fetch(url, {
        method: quiz ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          postId: postId === 'none' ? null : postId,
          isActive,
          showAnswers,
          trackScores,
          questions: questions.map((q, index) => ({
            question: q.question,
            type: q.type,
            options: q.type === 'FILL_IN_BLANK' ? [] : q.options.filter(opt => opt.trim()),
            correctAnswer: q.correctAnswer,
            order: index,
            points: q.points
          }))
        })
      })

      if (!response.ok) {
        throw new Error('İşlem başarısız')
      }

      toast.success(quiz ? 'Quiz güncellendi' : 'Quiz oluşturuldu')
      router.push('/dashboard/quizzes')
      router.refresh()
    } catch (error) {
      console.error('Error saving quiz:', error)
      toast.error('Quiz kaydedilemedi')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quiz başlığı"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quiz açıklaması (isteğe bağlı)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="postId">Blog Yazısı (İsteğe Bağlı)</Label>
            <Select value={postId} onValueChange={setPostId}>
              <SelectTrigger>
                <SelectValue placeholder="Yazı seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Seçilmedi</SelectItem>
                {posts.map((post) => (
                  <SelectItem key={post.id} value={post.id}>
                    {post.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked as boolean)}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Quiz'i aktif et
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="showAnswers"
                checked={showAnswers}
                onCheckedChange={(checked) => setShowAnswers(checked as boolean)}
              />
              <Label htmlFor="showAnswers" className="cursor-pointer">
                Gönderimden sonra doğru cevapları göster
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="trackScores"
                checked={trackScores}
                onCheckedChange={(checked) => setTrackScores(checked as boolean)}
              />
              <Label htmlFor="trackScores" className="cursor-pointer">
                Puanları kaydet ve takip et
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Sorular</h3>
          <Button type="button" onClick={addQuestion} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Soru Ekle
          </Button>
        </div>

        {questions.map((question, qIndex) => (
          <Card key={qIndex}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-base">Soru {qIndex + 1}</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Soru Metni *</Label>
                <Textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  placeholder="Sorunuzu yazın"
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Soru Tipi</Label>
                  <Select
                    value={question.type}
                    onValueChange={(value) => updateQuestion(qIndex, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MULTIPLE_CHOICE">Çoktan Seçmeli</SelectItem>
                      <SelectItem value="TRUE_FALSE">Doğru/Yanlış</SelectItem>
                      <SelectItem value="FILL_IN_BLANK">Boşluk Doldurma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Puan</Label>
                  <Input
                    type="number"
                    min="1"
                    value={question.points}
                    onChange={(e) => updateQuestion(qIndex, 'points', Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Options for MULTIPLE_CHOICE */}
              {question.type === 'MULTIPLE_CHOICE' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Seçenekler</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(qIndex)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Seçenek Ekle
                    </Button>
                  </div>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        placeholder={`Seçenek ${oIndex + 1}`}
                      />
                      {question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(qIndex, oIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Options for TRUE_FALSE */}
              {question.type === 'TRUE_FALSE' && (
                <div>
                  <Label>Seçenekler</Label>
                  <div className="space-y-2 mt-2">
                    <div className="p-2 bg-gray-50 rounded">Doğru</div>
                    <div className="p-2 bg-gray-50 rounded">Yanlış</div>
                  </div>
                </div>
              )}

              <div>
                <Label>Doğru Cevap *</Label>
                {question.type === 'MULTIPLE_CHOICE' ? (
                  <Select
                    value={question.correctAnswer}
                    onValueChange={(value) => updateQuestion(qIndex, 'correctAnswer', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Doğru cevabı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.filter(opt => opt.trim()).map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : question.type === 'TRUE_FALSE' ? (
                  <Select
                    value={question.correctAnswer}
                    onValueChange={(value) => updateQuestion(qIndex, 'correctAnswer', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Doğru cevabı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Doğru">Doğru</SelectItem>
                      <SelectItem value="Yanlış">Yanlış</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={question.correctAnswer}
                    onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                    placeholder="Doğru cevabı yazın"
                    required
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Kaydediliyor...' : quiz ? 'Güncelle' : 'Oluştur'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/quizzes')}
        >
          İptal
        </Button>
      </div>
    </form>
  )
}
