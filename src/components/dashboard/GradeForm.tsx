'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface GradeFormProps {
  studentId: string
  grade?: {
    id: string
    testName: string
    subject: string
    score: number
    maxScore: number
    date: Date
  }
}

export default function GradeForm({ studentId, grade }: GradeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [testName, setTestName] = useState(grade?.testName || '')
  const [subject, setSubject] = useState(grade?.subject || '')
  const [score, setScore] = useState(grade?.score.toString() || '')
  const [maxScore, setMaxScore] = useState(grade?.maxScore.toString() || '100')
  const [date, setDate] = useState(
    grade?.date ? new Date(grade.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = grade ? `/api/grades/${grade.id}` : '/api/grades'
      const method = grade ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testName,
          subject,
          score: parseFloat(score),
          maxScore: parseFloat(maxScore),
          date,
          userId: studentId
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save grade')
      }

      toast.success(grade ? 'Sınav sonucu güncellendi' : 'Sınav sonucu eklendi')
      router.push(`/dashboard/students/${studentId}/grades`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{grade ? 'Sınav Sonucunu Düzenle' : 'Yeni Sınav Sonucu'}</CardTitle>
        <CardDescription>
          Öğrencinin sınav sonucunu kaydedin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testName">Sınav Adı *</Label>
            <Input
              id="testName"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Örn: Vize Sınavı"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Ders *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Örn: Matematik"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Alınan Puan *</Label>
              <Input
                id="score"
                type="number"
                step="0.01"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Örn: 85"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxScore">Maksimum Puan *</Label>
              <Input
                id="maxScore"
                type="number"
                step="0.01"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                placeholder="Örn: 100"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Sınav Tarihi *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {score && maxScore && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Yüzdelik Not</p>
              <p className="text-2xl font-bold text-blue-600">
                %{((parseFloat(score) / parseFloat(maxScore)) * 100).toFixed(1)}
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Kaydediliyor...' : grade ? 'Güncelle' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
