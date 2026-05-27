import { useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  imageUrl: string
  onChange: (url: string) => void
}

export default function ImageUpload({ imageUrl, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop() || 'png'
    const fileName = `${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('dishes')
      .upload(fileName, file)

    if (error) {
      alert('上传失败: ' + error.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('dishes')
      .getPublicUrl(fileName)

    onChange(publicUrl)
    setUploading(false)
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
          <span className="text-sm mt-1">{uploading ? '上传中...' : '点击上传图片'}</span>
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
