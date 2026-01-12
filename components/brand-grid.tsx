"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const brands = [
  {
    name: "MARSMADE",
    href: "/brands/marsmade",
    tagline: "Eco Hair & Body Care",
    desc: "#1 Amazon New Release. Solid shampoo bars, sustainable beauty. High margin, low return rate.",
    color: "#4AE3C3",
    stats: "15 SKUs Available",
  },
  {
    name: "KIERO",
    href: "/brands/kiero",
    tagline: "Premium K-Beauty Skincare",
    desc: "Cica, Centella, Vitamin C lines. LATAM-ready packaging. FDA registered.",
    color: "#EC4899",
    stats: "8 SKUs Available",
  },
  {
    name: "CODE BRO",
    href: "/brands/code-bro",
    tagline: "Men's Intimate Care",
    desc: "$500K first month on TikTok Shop. Untapped men's category. Viral content library included.",
    color: "#3B82F6",
    stats: "8 SKUs Available",
  },
  {
    name: "Your Store",
    href: "#contact",
    tagline: "Stock Our Brands",
    desc: "Flexible MOQ. US warehouse ready. Marketing support included.",
    color: "#A855F7",
    stats: "Inquire Now",
  },
]

export function BrandGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
      {brands.map((brand, i) => (
        <motion.div
          key={brand.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Link href={brand.href} className="brand-tile block group">
            {/* Top accent line */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: brand.color }}
            />

            {/* Category badge */}
            <span className="text-xs font-semibold uppercase tracking-wider mb-3 block" style={{ color: brand.color }}>
              {brand.tagline}
            </span>

            {/* Brand name */}
            <span className="text-3xl md:text-4xl font-bold text-white tracking-tight transition-transform duration-500 group-hover:-translate-y-2 block">
              {brand.name}
            </span>

            <p className="text-white/40 text-sm mt-2 leading-relaxed">{brand.desc}</p>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="text-white/60 text-xs">{brand.stats}</span>
            </div>

            {/* Hover arrow */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <span className="flex items-center gap-2 text-sm font-medium" style={{ color: brand.color }}>
                {brand.name === "Your Store" ? "Contact Sales" : "View Products"}
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
