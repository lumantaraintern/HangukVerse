'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null
  url: string | null
  size: number
  onUpload: (url: string) => void
}) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        if (!path) return

        // If path is an external URL, use it directly
        if (path.startsWith('http')) {
          setAvatarUrl(path)
          return
        }

        // Otherwise, download from Supabase
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) throw error
        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    downloadImage(url ?? '')
  }, [url, supabase])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
      if (uploadError) throw uploadError

      onUpload(filePath) // Update parent component
    } catch (error) {
      console.log(error)
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full object-cover"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="rounded-full bg-gray-300 flex items-center justify-center"
          style={{ height: size, width: size }}
        >
          ?
        </div>
      )}

      <div className="relative w-max">
        <button
          type="button"
          className="px-4 py-1 bg-[#630063] hover:bg-[#DB31DB] text-white rounded-md"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

    </div>
  )
}
