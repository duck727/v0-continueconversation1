import type { ReactNode } from "react"

interface SectionProps {
  id?: string
  className?: string
  children: ReactNode
}

export function Section({ id, className = "", children }: SectionProps) {
  return (
    <section id={id} className={`snap-section min-h-screen flex flex-col justify-center relative ${className}`}>
      {children}
    </section>
  )
}
