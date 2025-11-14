import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import NotificationsTable from '@/components/dashboard/NotificationsTable'

export default async function NotificationsPage() {
  await requireAdmin()

  const notifications = await prisma.notification.findMany({
    orderBy: { order: 'asc' }
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bildirimler</h1>
          <p className="text-gray-600 mt-1">Ana sayfada gösterilecek bildirimleri yönetin</p>
        </div>
        <Link href="/dashboard/notifications/create">
          <Button>Yeni Bildirim</Button>
        </Link>
      </div>

      <NotificationsTable notifications={notifications} />
    </div>
  )
}
