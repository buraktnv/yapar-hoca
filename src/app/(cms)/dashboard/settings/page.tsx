import { requireAdmin } from '@/lib/auth/helpers'
import prisma from '@/lib/prisma'
import SettingsForm from '@/components/dashboard/SettingsForm'

export const metadata = {
  title: 'Site Settings | Dashboard',
  description: 'Manage site settings',
}

export default async function SettingsPage() {
  await requireAdmin()

  // Get or create default settings
  let settings = await prisma.siteSettings.findUnique({
    where: { id: 'default' }
  })

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: 'default'
      }
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Site Ayarları</h1>
        <p className="mt-2 text-gray-600">
          Favicon ve logo ayarlarını yönetin
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  )
}
