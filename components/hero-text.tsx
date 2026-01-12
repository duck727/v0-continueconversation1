"use client"

import { motion } from "framer-motion"

interface HeroTextProps {
  lines: string[]
  className?: string
}

export function HeroText({ lines, className = "" }: HeroTextProps) {
  return (
    <h1 className={className}>
      {lines.map((line, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: index * 0.12,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="block"
        >
          {line}
        </motion.span>
      ))}
    </h1>
  )
}
