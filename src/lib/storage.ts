export async function uploadImage(file: File, bucket: string = 'blog-images'): Promise<string> {
  // Use API route that uses service role key to bypass RLS
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Error uploading image:', error)
    throw new Error(error.error || 'Failed to upload image')
  }

  const { url } = await response.json()
  return url
}

export async function deleteImage(url: string, bucket: string = 'blog-images'): Promise<void> {
  // Use API route that uses service role key to bypass RLS
  const response = await fetch('/api/upload/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Error deleting image:', error)
    throw new Error(error.error || 'Failed to delete image')
  }
}
