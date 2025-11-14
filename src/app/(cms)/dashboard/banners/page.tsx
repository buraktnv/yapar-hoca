import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import BannersTable from '@/components/dashboard/BannersTable'

export default async function BannersPage() {
  await requireAdmin()

  const banners = await prisma.banner.findMany({
    orderBy: { order: 'asc' }
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bannerlar</h1>
          <p className="text-gray-600 mt-1">Ana sayfa banner içeriklerini yönetin</p>
        </div>
        <Link href="/dashboard/banners/create">
          <Button>Yeni Banner</Button>
        </Link>
      </div>

      <BannersTable banners={banners} />
    </div>
  )
}
