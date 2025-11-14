import { requireAuth, getUserRole } from '@/lib/auth/helpers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, FolderOpen, Users } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export const metadata = {
  title: 'Dashboard | YaparHoca',
  description: 'Blog yönetim paneli',
}

export default async function DashboardPage() {
  const user = await requireAuth()
  const userRole = await getUserRole()

  // Get stats
  const [postsCount, categoriesCount, usersCount] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.user.count(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hoş Geldiniz!</h1>
        <p className="mt-2 text-gray-600">
          Blogunuzu yönetmek için dashboard'u kullanabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/posts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Toplam Yazı
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postsCount}</div>
              <p className="text-xs text-muted-foreground">
                Yayınlanan ve taslak yazılar
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/categories">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Kategoriler
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoriesCount}</div>
              <p className="text-xs text-muted-foreground">
                Aktif kategoriler
              </p>
            </CardContent>
          </Card>
        </Link>

        {userRole?.role === 'ADMIN' && (
          <Link href="/dashboard/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Kullanıcılar
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usersCount}</div>
                <p className="text-xs text-muted-foreground">
                  Kayıtlı kullanıcılar
                </p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
            <CardDescription>
              En çok kullanılan işlemler
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link
              href="/dashboard/posts/create"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-5 w-5 mr-3 text-gray-600" />
              <div>
                <p className="font-medium">Yeni Blog Yazısı</p>
                <p className="text-sm text-gray-500">Yeni bir blog yazısı oluştur</p>
              </div>
            </Link>
            <Link
              href="/dashboard/categories"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderOpen className="h-5 w-5 mr-3 text-gray-600" />
              <div>
                <p className="font-medium">Kategorileri Yönet</p>
                <p className="text-sm text-gray-500">Kategorileri düzenle veya yeni kategori ekle</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
