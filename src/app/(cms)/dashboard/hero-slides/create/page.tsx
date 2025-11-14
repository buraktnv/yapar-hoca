import { requireAdmin } from '@/lib/auth/helpers'
import HeroSlideForm from '@/components/dashboard/HeroSlideForm'

export default async function CreateHeroSlidePage() {
  await requireAdmin()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Yeni Slider</h1>
        <p className="text-gray-600 mt-1">Ana sayfa slider içeriği oluşturun</p>
      </div>

      <HeroSlideForm />
    </div>
  )
}
