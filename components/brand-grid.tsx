"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { EditableImage } from "@/components/editable-image"
import { EditableText } from "@/components/editable-text"

const brands = [
  {
    name: "MARSMADE",
    href: "/brands/marsmade",
    tagline: "Solid care. Zero waste.",
    description: "Amazon best-seller shampoo bars with proven viral success.",
    color: "from-emerald-500 to-teal-400",
    image: "/tiktok-dermafirm-eyebrow-beauty.jpg",
  },
  {
    name: "KIERO",
    href: "/brands/kiero",
    tagline: "K-Beauty meets LATAM.",
    description: "Practical, effective skincare built for global markets.",
    color: "from-pink-500 to-rose-400",
    image: "/tiktok-its-skin-korean-beauty.jpg",
  },
  {
    name: "CODE BRO",
    href: "/brands/code-bro",
    tagline: "Men's care, built to convert.",
    description: "TikTok Shop sensation with 500K+ GMV in first month.",
    color: "from-blue-500 to-indigo-400",
    image: "/tiktok-maxclinic-skincare-product.jpg",
  },
  {
    name: "404 LAB",
    href: "/brands/404-lab",
    tagline: "Trend-first beauty.",
    description: "Experimental beauty essentials for the next generation.",
    color: "from-purple-500 to-violet-400",
    image: "/tiktok-milk-touch-mascara-beauty.jpg",
  },
]

export function BrandGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {brands.map((brand, index) => (
        <motion.div
          key={brand.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Link href={brand.href} className="brand-tile-slush block group">
            {/* Gradient accent */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-gradient-to-r ${brand.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <EditableImage
              storageKey={`brand-tile-image-${brand.name.toLowerCase().replace(/\\s+/g, "-")}`}
              defaultSrc={brand.image}
              alt={`${brand.name} preview`}
              className="mb-6"
              imageClassName="h-[180px]"
            />

            {/* Brand name */}
            <span className="brand-name text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {brand.name}
            </span>

            {/* Tagline */}
            <EditableText
              storageKey={`brand-tile-tagline-${brand.name.toLowerCase().replace(/\\s+/g, "-")}`}
              defaultValue={brand.tagline}
              className="text-white/40 text-sm mt-3 tracking-wide"
              as="p"
            />

            {/* Hover content */}
            <div className="hover-content">
              <EditableText
                storageKey={`brand-tile-description-${brand.name.toLowerCase().replace(/\\s+/g, "-")}`}
                defaultValue={brand.description}
                className="text-white/60 text-sm mb-4 leading-relaxed"
                as="p"
              />
              <span
                className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${brand.color} bg-clip-text text-transparent`}
              >
                Explore Brand
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
