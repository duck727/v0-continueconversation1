"use client"

import { useEffect, useState } from "react"

export function useLocalStorageState(key: string, defaultValue: string) {
  const [value, setValue] = useState(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(key)
    if (stored !== null) {
      setValue(stored)
    }
    setIsHydrated(true)
  }, [key])

  useEffect(() => {
    if (!isHydrated) {
      return
    }
    window.localStorage.setItem(key, value)
  }, [isHydrated, key, value])

  return [value, setValue] as const
}
