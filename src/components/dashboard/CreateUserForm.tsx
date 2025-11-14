'use client'

import { useState } from 'react'
import { createUserAsAdmin } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Copy, Check } from 'lucide-react'

export default function CreateUserForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<'ADMIN' | 'USER'>('USER')
  const [showPassword, setShowPassword] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState<string>('')
  const [generatedEmail, setGeneratedEmail] = useState<string>('')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const name = formData.get('name') as string

    const result = await createUserAsAdmin(email, name, role)

    setIsLoading(false)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success && result.password) {
      setSuccess(result.message || 'User created successfully!')
      setGeneratedPassword(result.password)
      setGeneratedEmail(result.email || email)
      setShowPassword(true)
      ;(e.target as HTMLFormElement).reset()
    }
  }

  function copyToClipboard() {
    const text = `E-posta: ${generatedEmail}\nŞifre: ${generatedPassword}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyPasswordOnly() {
    navigator.clipboard.writeText(generatedPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Bilgileri</CardTitle>
          <CardDescription>
            Kullanıcı oluşturulacak ve şifre size gösterilecektir. Şifreyi kullanıcıyla paylaşabilirsiniz.
          </CardDescription>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Ahmet Yılmaz"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select value={role} onValueChange={(value) => setRole(value as 'ADMIN' | 'USER')} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Rol seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Kullanıcı</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Admin: Tüm yetkilere sahip. Kullanıcı: Sadece blog yazma yetkisi.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
          </Button>
        </form>
      </CardContent>
    </Card>

    <Dialog open={showPassword} onOpenChange={setShowPassword}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kullanıcı Oluşturuldu!</DialogTitle>
          <DialogDescription>
            Kullanıcı başarıyla oluşturuldu. Aşağıdaki bilgileri kullanıcıyla paylaşın.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">E-posta</p>
              <p className="text-base font-mono">{generatedEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Şifre</p>
              <p className="text-base font-mono break-all">{generatedPassword}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={copyToClipboard} className="flex-1">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Kopyalandı!' : 'Tümünü Kopyala'}
            </Button>
            <Button onClick={copyPasswordOnly} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Sadece Şifre
            </Button>
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              Bu şifreyi güvenli bir şekilde kullanıcıyla paylaşın. Kullanıcı giriş yaptıktan sonra şifresini değiştirebilir.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
