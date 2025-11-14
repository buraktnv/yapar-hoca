import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Award, User } from 'lucide-react'

export default async function StudentsPage() {
  await requireAdmin()

  const students = await prisma.user.findMany({
    where: { role: 'USER' },
    include: {
      _count: {
        select: {
          notes: true,
          grades: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Öğrenciler</h1>
        <p className="text-gray-600 mt-2">
          Öğrenci notlarını ve sınav sonuçlarını yönet
        </p>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">
              Henüz öğrenci yok. <Link href="/dashboard/users/create" className="text-blue-600 hover:underline">Yeni öğrenci ekle</Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{student.name || 'İsimsiz'}</CardTitle>
                      <CardDescription className="text-sm">{student.email}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{student._count.notes} Not</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>{student._count.grades} Sınav</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1" size="sm">
                    <Link href={`/dashboard/students/${student.id}/notes`}>
                      <FileText className="h-4 w-4 mr-2" />
                      Notlar
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1" size="sm">
                    <Link href={`/dashboard/students/${student.id}/grades`}>
                      <Award className="h-4 w-4 mr-2" />
                      Sınavlar
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
