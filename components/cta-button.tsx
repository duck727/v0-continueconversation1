import Link from "next/link"
import type { ReactNode } from "react"

interface CTAButtonProps {
  href: string
  variant?: "primary" | "outline"
  children: ReactNode
  className?: string
}

export function CTAButton({ href, variant = "primary", children, className = "" }: CTAButtonProps) {
  const baseClass = variant === "primary" ? "cta-btn cta-btn-primary" : "cta-btn cta-btn-outline"

  if (href.startsWith("#")) {
    return (
      <a href={href} className={`${baseClass} ${className}`}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={`${baseClass} ${className}`}>
      {children}
    </Link>
  )
}
