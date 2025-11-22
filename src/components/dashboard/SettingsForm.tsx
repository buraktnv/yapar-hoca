'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { Upload, X, Image as ImageIcon, Type, ImageIcon as ImageLogo } from 'lucide-react'
import Image from 'next/image'

interface Settings {
  id: string
  faviconUrl: string | null
  favicon16Url: string | null
  favicon32Url: string | null
  favicon180Url: string | null
  favicon192Url: string | null
  favicon512Url: string | null
  logoUrl: string | null
  siteName: string
  brandingType: string
  brandingLogoUrl: string | null
  brandingIconUrl: string | null
}

interface SettingsFormProps {
  settings: Settings
}

interface FaviconSize {
  key: keyof Pick<Settings, 'faviconUrl' | 'favicon16Url' | 'favicon32Url' | 'favicon180Url' | 'favicon192Url' | 'favicon512Url'>
  label: string
  description: string
  size: string
  previewSize: number
}

const faviconSizes: FaviconSize[] = [
  { key: 'faviconUrl', label: 'Ana Favicon', description: 'Varsayılan favicon (tüm boyutlar için kullanılır)', size: 'Herhangi', previewSize: 32 },
  { key: 'favicon16Url', label: '16x16', description: 'Tarayıcı sekmesi için küçük ikon', size: '16x16 px', previewSize: 16 },
  { key: 'favicon32Url', label: '32x32', description: 'Tarayıcı sekmesi için standart ikon', size: '32x32 px', previewSize: 32 },
  { key: 'favicon180Url', label: '180x180', description: 'Apple Touch Icon (iOS cihazlar)', size: '180x180 px', previewSize: 48 },
  { key: 'favicon192Url', label: '192x192', description: 'Android Chrome ikonu', size: '192x192 px', previewSize: 48 },
  { key: 'favicon512Url', label: '512x512', description: 'Büyük ikon (PWA splash screen)', size: '512x512 px', previewSize: 64 },
]

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [favicons, setFavicons] = useState({
    faviconUrl: settings.faviconUrl || '',
    favicon16Url: settings.favicon16Url || '',
    favicon32Url: settings.favicon32Url || '',
    favicon180Url: settings.favicon180Url || '',
    favicon192Url: settings.favicon192Url || '',
    favicon512Url: settings.favicon512Url || '',
  })
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '')
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)

  // Branding state
  const [siteName, setSiteName] = useState(settings.siteName || 'YaparHoca')
  const [brandingType, setBrandingType] = useState(settings.brandingType || 'text')
  const [brandingLogoUrl, setBrandingLogoUrl] = useState(settings.brandingLogoUrl || '')
  const [brandingIconUrl, setBrandingIconUrl] = useState(settings.brandingIconUrl || '')
  const [brandingLogoUploading, setBrandingLogoUploading] = useState(false)
  const [brandingIconUploading, setBrandingIconUploading] = useState(false)

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof favicons) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['image/x-icon', 'image/png', 'image/svg+xml', 'image/ico', 'image/vnd.microsoft.icon', 'image/jpeg', 'image/webp']
    if (!validTypes.includes(file.type) && !file.name.endsWith('.ico')) {
      toast.error('Sadece .ico, .png, .svg, .jpg veya .webp dosyaları kabul edilir')
      return
    }

    setUploadingKey(key)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setFavicons(prev => ({ ...prev, [key]: data.url }))
      toast.success('Görsel yüklendi')
    } catch (error) {
      console.error('Error uploading favicon:', error)
      toast.error('Görsel yüklenemedi')
    } finally {
      setUploadingKey(null)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları kabul edilir')
      return
    }

    setLogoUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setLogoUrl(data.url)
      toast.success('Logo yüklendi')
    } catch (error) {
      console.error('Error uploading logo:', error)
      toast.error('Logo yüklenemedi')
    } finally {
      setLogoUploading(false)
    }
  }

  const handleBrandingLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları kabul edilir')
      return
    }

    setBrandingLogoUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setBrandingLogoUrl(data.url)
      toast.success('Logo yüklendi')
    } catch (error) {
      console.error('Error uploading branding logo:', error)
      toast.error('Logo yüklenemedi')
    } finally {
      setBrandingLogoUploading(false)
    }
  }

  const handleBrandingIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları kabul edilir')
      return
    }

    setBrandingIconUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setBrandingIconUrl(data.url)
      toast.success('İkon yüklendi')
    } catch (error) {
      console.error('Error uploading branding icon:', error)
      toast.error('İkon yüklenemedi')
    } finally {
      setBrandingIconUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faviconUrl: favicons.faviconUrl || null,
          favicon16Url: favicons.favicon16Url || null,
          favicon32Url: favicons.favicon32Url || null,
          favicon180Url: favicons.favicon180Url || null,
          favicon192Url: favicons.favicon192Url || null,
          favicon512Url: favicons.favicon512Url || null,
          logoUrl: logoUrl || null,
          siteName: siteName || 'YaparHoca',
          brandingType,
          brandingLogoUrl: brandingLogoUrl || null,
          brandingIconUrl: brandingIconUrl || null
        })
      })

      if (!response.ok) throw new Error('Failed to save settings')

      toast.success('Ayarlar kaydedildi')
      router.refresh()
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Ayarlar kaydedilemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const clearFavicon = (key: keyof typeof favicons) => {
    setFavicons(prev => ({ ...prev, [key]: '' }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Site Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Site Başlığı / Logo</CardTitle>
          <CardDescription>
            Navbar&apos;da görünecek site başlığını veya logosunu ayarlayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="siteName">Site Adı</Label>
            <Input
              id="siteName"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="YaparHoca"
              className="max-w-sm mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Metin modunda veya ikon+metin modunda gösterilecek
            </p>
          </div>

          <div>
            <Label className="mb-3 block">Görünüm Tipi</Label>
            <RadioGroup value={brandingType} onValueChange={setBrandingType} className="grid gap-4 md:grid-cols-3">
              <div className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer ${brandingType === 'text' ? 'border-blue-500 bg-blue-50' : ''}`}>
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text" className="cursor-pointer flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Sadece Metin</div>
                    <div className="text-xs text-gray-500">Site adı metin olarak gösterilir</div>
                  </div>
                </Label>
              </div>
              <div className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer ${brandingType === 'logo' ? 'border-blue-500 bg-blue-50' : ''}`}>
                <RadioGroupItem value="logo" id="logo" />
                <Label htmlFor="logo" className="cursor-pointer flex items-center gap-2">
                  <ImageLogo className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Sadece Logo</div>
                    <div className="text-xs text-gray-500">Yüklenen logo gösterilir</div>
                  </div>
                </Label>
              </div>
              <div className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer ${brandingType === 'icon_text' ? 'border-blue-500 bg-blue-50' : ''}`}>
                <RadioGroupItem value="icon_text" id="icon_text" />
                <Label htmlFor="icon_text" className="cursor-pointer flex items-center gap-2">
                  <div className="flex items-center">
                    <ImageLogo className="h-4 w-4" />
                    <Type className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">İkon + Metin</div>
                    <div className="text-xs text-gray-500">Küçük ikon ve site adı</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Logo upload for "logo" mode */}
          {brandingType === 'logo' && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="mb-3 block">Navbar Logosu</Label>
              {brandingLogoUrl ? (
                <div className="flex items-center gap-4">
                  <div className="relative h-12 bg-white border rounded-lg overflow-hidden flex items-center justify-center px-4">
                    <Image
                      src={brandingLogoUrl}
                      alt="Branding logo"
                      width={150}
                      height={40}
                      className="object-contain h-10"
                    />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setBrandingLogoUrl('')}>
                    <X className="h-4 w-4 mr-1" /> Kaldır
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleBrandingLogoUpload}
                    disabled={brandingLogoUploading}
                    className="hidden"
                    id="branding-logo-upload"
                  />
                  <Label
                    htmlFor="branding-logo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    <Upload className="h-4 w-4" />
                    {brandingLogoUploading ? 'Yükleniyor...' : 'Logo Yükle'}
                  </Label>
                </div>
              )}
            </div>
          )}

          {/* Icon upload for "icon_text" mode */}
          {brandingType === 'icon_text' && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="mb-3 block">Navbar İkonu (küçük resim)</Label>
              {brandingIconUrl ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 bg-white border rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src={brandingIconUrl}
                      alt="Branding icon"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setBrandingIconUrl('')}>
                    <X className="h-4 w-4 mr-1" /> Kaldır
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleBrandingIconUpload}
                    disabled={brandingIconUploading}
                    className="hidden"
                    id="branding-icon-upload"
                  />
                  <Label
                    htmlFor="branding-icon-upload"
                    className="cursor-pointer inline-flex items-center gap-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    <Upload className="h-4 w-4" />
                    {brandingIconUploading ? 'Yükleniyor...' : 'İkon Yükle'}
                  </Label>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Önerilen boyut: 32x32 veya 48x48 piksel
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="border rounded-lg p-4">
            <Label className="mb-3 block">Önizleme</Label>
            <div className="bg-white border rounded-lg p-3 flex items-center gap-2">
              {brandingType === 'text' && (
                <span className="text-xl font-bold text-blue-600">{siteName || 'YaparHoca'}</span>
              )}
              {brandingType === 'logo' && brandingLogoUrl && (
                <Image
                  src={brandingLogoUrl}
                  alt="Logo preview"
                  width={150}
                  height={40}
                  className="object-contain h-10"
                />
              )}
              {brandingType === 'logo' && !brandingLogoUrl && (
                <span className="text-gray-400">Logo yüklenmedi</span>
              )}
              {brandingType === 'icon_text' && (
                <div className="flex items-center gap-2">
                  {brandingIconUrl ? (
                    <Image
                      src={brandingIconUrl}
                      alt="Icon"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <ImageLogo className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  <span className="text-xl font-bold text-blue-600">{siteName || 'YaparHoca'}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favicons */}
      <Card>
        <CardHeader>
          <CardTitle>Site İkonları (Favicons)</CardTitle>
          <CardDescription>
            Farklı cihazlar ve platformlar için site ikonlarınızı yükleyin.
            Sadece ana favicon yüklerseniz, tüm boyutlar için o kullanılır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {faviconSizes.map((favicon) => (
              <div key={favicon.key} className="border rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="font-medium">{favicon.label}</h4>
                  <p className="text-sm text-gray-500">{favicon.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Boyut: {favicon.size}</p>
                </div>

                {favicons[favicon.key] ? (
                  <div className="flex items-center gap-3">
                    <div
                      className="border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center"
                      style={{ width: favicon.previewSize + 16, height: favicon.previewSize + 16 }}
                    >
                      <Image
                        src={favicons[favicon.key]}
                        alt={favicon.label}
                        width={favicon.previewSize}
                        height={favicon.previewSize}
                        className="object-contain"
                      />
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => clearFavicon(favicon.key)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-16 border-2 border-dashed rounded-lg bg-gray-50">
                    <span className="text-gray-400 text-sm">Yüklenmedi</span>
                  </div>
                )}

                <div>
                  <Input
                    type="file"
                    accept=".ico,.png,.svg,.jpg,.jpeg,.webp,image/*"
                    onChange={(e) => handleFaviconUpload(e, favicon.key)}
                    disabled={uploadingKey === favicon.key}
                    className="hidden"
                    id={`favicon-upload-${favicon.key}`}
                  />
                  <Label
                    htmlFor={`favicon-upload-${favicon.key}`}
                    className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 w-full"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingKey === favicon.key ? 'Yükleniyor...' : 'Yükle'}
                  </Label>
                </div>

                <Input
                  value={favicons[favicon.key]}
                  onChange={(e) => setFavicons(prev => ({ ...prev, [favicon.key]: e.target.value }))}
                  placeholder="veya URL girin"
                  className="text-xs"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Genel Logo</CardTitle>
          <CardDescription>
            Diğer alanlarda kullanılacak site logosu (footer, paylaşımlar vb.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logoUrl && (
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-16 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <Image
                    src={logoUrl}
                    alt="Current logo"
                    width={120}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setLogoUrl('')}>
                  <X className="h-4 w-4 mr-1" /> Kaldır
                </Button>
              </div>
            )}

            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={logoUploading}
                className="hidden"
                id="logo-upload"
              />
              <Label
                htmlFor="logo-upload"
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                <ImageIcon className="h-4 w-4" />
                {logoUploading ? 'Yükleniyor...' : 'Logo Yükle'}
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">veya URL girin</Label>
              <Input
                id="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
      </Button>
    </form>
  )
}
