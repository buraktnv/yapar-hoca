'use client'

import { useState } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import Link from 'next/link'

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  createdBy: {
    name: string | null
  }
}

interface StudentNotesTableProps {
  notes: Note[]
  studentId: string
}

export default function StudentNotesTable({ notes, studentId }: StudentNotesTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete(noteId: string) {
    setIsLoading(true)

    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete note')
      }

      toast.success('Not silindi')
      window.location.reload()
    } catch (error) {
      toast.error('Not silinirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>
                  {note.createdBy.name} • {new Date(note.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/students/${studentId}/notes/edit/${note.id}`}>
                  <Button variant="ghost" size="sm" disabled={isLoading}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
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
                        Bu notu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(note.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Sil
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
