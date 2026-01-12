"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const buttons = [
  { bg: "#FFFFFF", text: "#030014" },
  { bg: "#FF6B35", text: "#FFFFFF" },
  { bg: "#4AE3C3", text: "#030014" },
  { bg: "#22C55E", text: "#FFFFFF" },
  { bg: "#A855F7", text: "#FFFFFF" },
  { bg: "#EC4899", text: "#FFFFFF" },
  { bg: "#3B82F6", text: "#FFFFFF" },
]

const ctaTexts = ["Stock Our Brands", "Become a Distributor", "Request Catalog", "Get Wholesale Pricing"]

export function CTAMarquee() {
  const allButtons = [...buttons, ...buttons, ...buttons]

  return (
    <div className="relative overflow-hidden py-5 bg-[#0a0a1a]">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a1a] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a1a] to-transparent z-10" />

      <motion.div
        className="flex"
        animate={{ x: [0, "-33.333%"] }}
        transition={{ x: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" } }}
      >
        {allButtons.map((btn, i) => (
          <Link
            key={i}
            href="#contact"
            className="cta-btn mx-2"
            style={{
              background: btn.bg,
              color: btn.text,
              boxShadow: `0 0 20px ${btn.bg}40`,
            }}
          >
            {ctaTexts[i % ctaTexts.length]}
          </Link>
        ))}
        {allButtons.map((btn, i) => (
          <Link
            key={`dup-${i}`}
            href="#contact"
            className="cta-btn mx-2"
            style={{
              background: btn.bg,
              color: btn.text,
              boxShadow: `0 0 20px ${btn.bg}40`,
            }}
          >
            {ctaTexts[i % ctaTexts.length]}
          </Link>
        ))}
      </motion.div>
    </div>
  )
}
