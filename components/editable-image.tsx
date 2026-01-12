"use client"

import { useEffect, useId, useState } from "react"
import Image from "next/image"
import { useLocalStorageState } from "@/lib/use-local-storage"

interface EditableImageProps {
  storageKey: string
  defaultSrc: string
  alt: string
  className?: string
  imageClassName?: string
}

export function EditableImage({
  storageKey,
  defaultSrc,
  alt,
  className = "",
  imageClassName = "",
}: EditableImageProps) {
  const [src, setSrc] = useLocalStorageState(storageKey, defaultSrc)
  const [isEditing, setIsEditing] = useState(false)
  const [preview, setPreview] = useState(src)
  const inputId = useId()

  useEffect(() => {
    setPreview(src)
  }, [src])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    setSrc(preview)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setPreview(src)
    setIsEditing(false)
  }

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <Image src={preview} alt={alt} width={1200} height={800} className={`h-full w-full object-cover ${imageClassName}`} />
      </div>
      {isEditing ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
          <label htmlFor={inputId} className="text-white/80">
            Upload new image
          </label>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-xs text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-blue-500/20 file:px-3 file:py-1.5 file:text-xs file:text-blue-200 hover:file:bg-blue-500/30"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <button type="button" onClick={handleSave} className="text-white/90 hover:text-white">
              Save image
            </button>
            <button type="button" onClick={handleCancel} className="text-white/60 hover:text-white">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="mt-3 text-xs text-blue-300/80 hover:text-blue-200"
        >
          Replace image
        </button>
      )}
    </div>
  )
}
