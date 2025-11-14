import { requireAdmin } from '@/lib/auth/helpers'
import CreateUserForm from '@/components/dashboard/CreateUserForm'

export const metadata = {
  title: 'Create User | Dashboard',
  description: 'Create a new user',
}

export default async function CreateUserPage() {
  await requireAdmin()

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Yeni Kullanıcı Oluştur</h1>
        <p className="mt-2 text-gray-600">
          Sisteme yeni kullanıcı ekleyin. Kullanıcı şifresini e-posta ile alacak.
        </p>
      </div>
      <CreateUserForm />
    </div>
  )
}
