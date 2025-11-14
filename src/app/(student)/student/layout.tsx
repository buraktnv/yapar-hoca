import { requireAuth } from '@/lib/auth/helpers'
import StudentSidebar from '@/components/student/StudentSidebar'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  // Check if user is actually a student (not admin)
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, name: true, email: true }
  })

  // If admin, redirect to dashboard
  if (dbUser?.role === 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <StudentSidebar user={{ name: dbUser?.name, email: dbUser?.email }} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
