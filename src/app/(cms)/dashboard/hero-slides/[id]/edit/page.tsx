import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import HeroSlideForm from '@/components/dashboard/HeroSlideForm'

export default async function EditHeroSlidePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const heroSlide = await prisma.heroSlide.findUnique({
    where: { id }
  })

  if (!heroSlide) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Slider Düzenle</h1>
        <p className="text-gray-600 mt-1">{heroSlide.title}</p>
      </div>

      <HeroSlideForm heroSlide={heroSlide} />
    </div>
  )
}
