import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/helpers'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Login | YaparHoca',
  description: 'Login to your account',
}

export default async function LoginPage() {
  const user = await getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            YaparHoca'ya Giriş Yapın
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Blogunuzu yönetmek için giriş yapın
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
