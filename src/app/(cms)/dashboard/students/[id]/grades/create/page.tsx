import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import GradeForm from '@/components/dashboard/GradeForm'
import { notFound } from 'next/navigation'

export default async function CreateGradePage({
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

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href={`/dashboard/students/${id}/grades`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sınav Sonuçlarına Dön
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Yeni Sınav Sonucu Ekle</h1>
        <p className="text-gray-600 mt-1">{student.name} için sınav sonucu ekle</p>
      </div>

      <GradeForm studentId={id} />
    </div>
  )
}
