import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus } from 'lucide-react'
import StudentNotesTable from '@/components/dashboard/StudentNotesTable'
import { notFound } from 'next/navigation'

export default async function StudentNotesPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const student = await prisma.user.findUnique({
    where: { id, role: 'USER' },
    select: { id: true, name: true, email: true }
  })

  if (!student) {
    notFound()
  }

  const notes = await prisma.note.findMany({
    where: { userId: id },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { name: true } }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/students">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Öğrencilere Dön
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{student.name || 'İsimsiz'} - Notlar</h1>
          <p className="text-gray-600 mt-1">{student.email}</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/students/${id}/notes/create`}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Not Ekle
          </Link>
        </Button>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">
              Bu öğrenci için henüz not yok.
            </p>
          </CardContent>
        </Card>
      ) : (
        <StudentNotesTable notes={notes} studentId={id} />
      )}
    </div>
  )
}
