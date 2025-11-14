import { requireAdmin } from '@/lib/auth/helpers'
import BannerForm from '@/components/dashboard/BannerForm'

export default async function CreateBannerPage() {
  await requireAdmin()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Yeni Banner</h1>
        <p className="text-gray-600 mt-1">Ana sayfa banner içeriği oluşturun</p>
      </div>

      <BannerForm />
    </div>
  )
}
