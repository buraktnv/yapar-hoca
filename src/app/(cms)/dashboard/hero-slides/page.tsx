import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import HeroSlidesTable from '@/components/dashboard/HeroSlidesTable'

export default async function HeroSlidesPage() {
  await requireAdmin()

  const heroSlides = await prisma.heroSlide.findMany({
    orderBy: { order: 'asc' }
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ana Slider</h1>
          <p className="text-gray-600 mt-1">Ana sayfa slider içeriklerini yönetin</p>
        </div>
        <Link href="/dashboard/hero-slides/create">
          <Button>Yeni Slide</Button>
        </Link>
      </div>

      <HeroSlidesTable heroSlides={heroSlides} />
    </div>
  )
}
