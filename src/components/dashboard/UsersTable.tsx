'use client'

import { useState } from 'react'
import { Trash2, Shield, ShieldOff } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  name: string | null
  role: 'ADMIN' | 'USER'
  isActive: boolean
  createdAt: Date
  _count: {
    posts: number
  }
}

interface UsersTableProps {
  users: User[]
}

export default function UsersTable({ users }: UsersTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleToggleStatus(userId: string, currentStatus: boolean) {
    setIsLoading(true)

    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (!res.ok) {
        throw new Error('Failed to update user status')
      }

      toast.success(currentStatus ? 'Kullanıcı devre dışı bırakıldı' : 'Kullanıcı aktif edildi')
      window.location.reload()
    } catch (error) {
      toast.error('Kullanıcı durumu güncellenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleRole(userId: string, currentRole: 'ADMIN' | 'USER') {
    setIsLoading(true)

    try {
      const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!res.ok) {
        throw new Error('Failed to update user role')
      }

      toast.success(`Kullanıcı rolü ${newRole === 'ADMIN' ? 'Admin' : 'Kullanıcı'} olarak güncellendi`)
      window.location.reload()
    } catch (error) {
      toast.error('Kullanıcı rolü güncellenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(userId: string) {
    setIsLoading(true)

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete user')
      }

      toast.success('Kullanıcı silindi')
      window.location.reload()
    } catch (error) {
      toast.error('Kullanıcı silinirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <p className="text-gray-500">Henüz kullanıcı yok</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ad</TableHead>
            <TableHead>E-posta</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="text-center">Yazı Sayısı</TableHead>
            <TableHead>Kayıt Tarihi</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.name || '-'}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.role === 'ADMIN' ? (
                  <Badge className="bg-purple-100 text-purple-800">
                    Admin
                  </Badge>
                ) : (
                  <Badge variant="secondary">Kullanıcı</Badge>
                )}
              </TableCell>
              <TableCell>
                {user.isActive ? (
                  <Badge className="bg-green-100 text-green-800">
                    Aktif
                  </Badge>
                ) : (
                  <Badge variant="destructive">Pasif</Badge>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Badge>{user._count.posts}</Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString('tr-TR')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleRole(user.id, user.role)}
                    disabled={isLoading}
                    title={user.role === 'ADMIN' ? 'Kullanıcıya düşür' : 'Admin yap'}
                  >
                    {user.role === 'ADMIN' ? (
                      <ShieldOff className="h-4 w-4" />
                    ) : (
                      <Shield className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                    disabled={isLoading}
                  >
                    {user.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={isLoading}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                          {user._count.posts > 0 && (
                            <span className="block mt-2 text-red-600">
                              Dikkat: Bu kullanıcının {user._count.posts} yazısı var! Yazılar da silinecek.
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}