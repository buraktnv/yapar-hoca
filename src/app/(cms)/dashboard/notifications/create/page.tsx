import { requireAdmin } from '@/lib/auth/helpers'
import NotificationForm from '@/components/dashboard/NotificationForm'

export default async function CreateNotificationPage() {
  await requireAdmin()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Yeni Bildirim</h1>
        <p className="text-gray-600 mt-1">Ana sayfa bildirimi oluşturun</p>
      </div>

      <NotificationForm />
    </div>
  )
}
