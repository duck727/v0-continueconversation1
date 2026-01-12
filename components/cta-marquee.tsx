"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const buttonThemes = [
  { bg: "bg-white", text: "text-[#030014]", glow: "rgba(255,255,255,0.4)" },
  { bg: "bg-[#FF6B35]", text: "text-white", glow: "rgba(255,107,53,0.5)" },
  { bg: "bg-[#3B82F6]", text: "text-white", glow: "rgba(59,130,246,0.5)" },
  { bg: "bg-[#22C55E]", text: "text-white", glow: "rgba(34,197,94,0.5)" },
  { bg: "bg-[#A855F7]", text: "text-white", glow: "rgba(168,85,247,0.5)" },
  { bg: "bg-[#EC4899]", text: "text-white", glow: "rgba(236,72,153,0.5)" },
  { bg: "bg-[#06B6D4]", text: "text-white", glow: "rgba(6,182,212,0.5)" },
]

function CTAButton({ theme, index }: { theme: (typeof buttonThemes)[0]; index: number }) {
  return (
    <Link
      href="#contact"
      className={`
        group relative inline-flex items-center justify-center
        px-8 py-4 mx-3
        ${theme.bg} ${theme.text}
        rounded-full font-semibold text-base
        transition-all duration-300 ease-out
        hover:scale-105
        shrink-0
      `}
      style={{
        boxShadow: `0 0 30px ${theme.glow}`,
      }}
    >
      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 rounded-full overflow-hidden">
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              transform: "translateX(-100%)",
              animation: "shimmer 1.5s infinite",
            }}
          />
        </span>
      </span>

      {/* Text */}
      <span className="relative z-10 whitespace-nowrap tracking-wide">Partner with EOEO</span>
    </Link>
  )
}

export function CTAMarquee() {
  // Create multiple sets of buttons for seamless loop
  const buttonSets = [...Array(3)].flatMap(() => buttonThemes)

  return (
    <div className="relative overflow-hidden py-6 bg-gradient-to-r from-[#030014] via-[#0a0520] to-[#030014]">
      {/* Top gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030014] to-transparent z-10" />
      {/* Bottom gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030014] to-transparent z-10" />

      {/* Marquee track */}
      <motion.div
        className="flex"
        animate={{
          x: [0, "-33.333%"],
        }}
        transition={{
          x: {
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          },
        }}
      >
        {buttonSets.map((theme, i) => (
          <CTAButton key={i} theme={theme} index={i} />
        ))}
        {/* Duplicate for seamless loop */}
        {buttonSets.map((theme, i) => (
          <CTAButton key={`dup-${i}`} theme={theme} index={i} />
        ))}
      </motion.div>
    </div>
  )
}
