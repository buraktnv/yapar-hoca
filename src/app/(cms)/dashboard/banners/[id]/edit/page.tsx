import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BannerForm from '@/components/dashboard/BannerForm'

export default async function EditBannerPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const banner = await prisma.banner.findUnique({
    where: { id }
  })

  if (!banner) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Banner Düzenle</h1>
        <p className="text-gray-600 mt-1">{banner.title}</p>
      </div>

      <BannerForm banner={banner} />
    </div>
  )
}
