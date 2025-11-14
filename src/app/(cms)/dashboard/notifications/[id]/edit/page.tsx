import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import NotificationForm from '@/components/dashboard/NotificationForm'

export default async function EditNotificationPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const notification = await prisma.notification.findUnique({
    where: { id }
  })

  if (!notification) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Bildirimi Düzenle</h1>
        <p className="text-gray-600 mt-1">{notification.title}</p>
      </div>

      <NotificationForm notification={notification} />
    </div>
  )
}
