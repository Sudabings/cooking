import { useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  imageUrl: string
  onChange: (url: string) => void
}

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const maxSize = 800
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height / width) * maxSize)
          width = maxSize
        } else {
          width = Math.round((width / height) * maxSize)
          height = maxSize
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('压缩失败'))
      }, 'image/jpeg', 0.7)
    }
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = URL.createObjectURL(file)
  })
}

export default function ImageUpload({ imageUrl, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const compressed = await compressImage(file)
      const fileName = `${Date.now()}.jpg`
      const { error } = await supabase.storage
        .from('dishes')
        .upload(fileName, compressed)

      if (error) {
        alert('上传失败: ' + error.message)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('dishes')
        .getPublicUrl(fileName)

      onChange(publicUrl)
    } catch (err) {
      alert('上传失败: ' + (err instanceof Error ? err.message : '未知错误'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      onClick={() => fileRef.current?.click()}
      className="w-full aspect-[4/3] rounded-xl bg-gray-100 overflow-hidden cursor-pointer"
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
          <span className="text-3xl">📷</span>
          <span className="text-sm mt-1">{uploading ? '压缩上传中...' : '点击上传图片'}</span>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}
