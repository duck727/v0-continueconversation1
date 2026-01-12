"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import { useLocalStorageState } from "@/lib/use-local-storage"

interface EditableTextProps {
  storageKey: string
  defaultValue: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function EditableText({ storageKey, defaultValue, className = "", as = "div" }: EditableTextProps) {
  const [value, setValue] = useLocalStorageState(storageKey, defaultValue)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const textareaId = useId()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const Element = as

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    if (isEditing) {
      requestAnimationFrame(() => textareaRef.current?.focus())
    }
  }, [isEditing])

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setDraft(value)
    setIsEditing(false)
  }

  const saveEditing = () => {
    setValue(draft.trim() === "" ? defaultValue : draft)
    setIsEditing(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "enter") {
      event.preventDefault()
      saveEditing()
    }
    if (event.key === "Escape") {
      event.preventDefault()
      cancelEditing()
    }
  }

  return (
    <div className={className}>
      {isEditing ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <label htmlFor={textareaId} className="sr-only">
            Edit text content
          </label>
          <textarea
            id={textareaId}
            ref={textareaRef}
            className="w-full resize-none bg-transparent text-white/90 placeholder:text-white/40 focus:outline-none text-sm md:text-base"
            rows={3}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/50">
            <button type="button" onClick={saveEditing} className="text-white/90 hover:text-white">
              Save
            </button>
            <button type="button" onClick={cancelEditing} className="hover:text-white">
              Cancel
            </button>
            <span>Press ⌘/Ctrl + Enter to save</span>
          </div>
        </div>
      ) : (
        <Element className="group inline-flex items-center gap-2">
          <span>{value}</span>
          <button
            type="button"
            onClick={startEditing}
            className="text-xs text-blue-300/70 opacity-0 transition-opacity group-hover:opacity-100"
          >
            Edit
          </button>
        </Element>
      )}
    </div>
  )
}
