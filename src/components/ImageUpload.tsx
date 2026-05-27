import { useRef, useState } from 'react'

interface Props {
  imageUrl: string
  onChange: (url: string) => void
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const maxSize = 600
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
      resolve(canvas.toDataURL('image/jpeg', 0.6))
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
      const base64 = await fileToBase64(file)
      onChange(base64)
    } catch (err) {
      alert('图片处理失败')
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
          <span className="text-sm mt-1">{uploading ? '压缩中...' : '点击上传图片'}</span>
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
