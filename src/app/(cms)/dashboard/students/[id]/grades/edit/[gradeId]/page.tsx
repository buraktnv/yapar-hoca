import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import GradeForm from '@/components/dashboard/GradeForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function EditGradePage({
  params
}: {
  params: Promise<{ id: string; gradeId: string }>
}) {
  await requireAdmin()
  const { id, gradeId } = await params

  const student = await prisma.user.findUnique({
    where: { id, role: 'USER' },
    select: { id: true, name: true, email: true }
  })

  if (!student) {
    notFound()
  }

  const grade = await prisma.grade.findUnique({
    where: { id: gradeId, userId: id }
  })

  if (!grade) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/students/${id}/grades`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notu Düzenle</h1>
          <p className="text-gray-600 mt-1">
            Öğrenci: {student.name || student.email}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <GradeForm studentId={id} grade={grade} />
      </div>
    </div>
  )
}
