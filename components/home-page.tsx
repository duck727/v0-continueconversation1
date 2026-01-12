"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { BrandGrid } from "@/components/brand-grid"
import { Marquee } from "@/components/marquee"
import { CTAMarquee } from "@/components/cta-marquee"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ArrowRight, Sparkles, TrendingUp, Users, Package, BarChart3 } from "lucide-react"
import type { SiteContent } from "@/lib/content"

const renderHeroMedia = (media?: SiteContent["home"]["hero"]["heroMedia"]) => {
  if (!media?.url) return null

  if (media.type === "video") {
    return (
      <video
        className="w-full h-full object-cover rounded-3xl border border-white/10 shadow-2xl"
        src={media.url}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
      />
    )
  }

  return (
    <img
      className="w-full h-full object-cover rounded-3xl border border-white/10 shadow-2xl"
      src={media.url}
      alt={media.alt ?? "Hero visual"}
    />
  )
}

export function HomePage({ content }: { content: SiteContent }) {
  const { hero } = content.home

  return (
    <div className="min-h-screen slush-bg">
      <Navbar />

      {/* HERO Section - PB Distribution focus */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-20">
        {/* Glow orbs */}
        <div className="glow-orb w-[600px] h-[600px] bg-[#4AE3C3]/20 -top-40 -left-40" />
        <div
          className="glow-orb w-[500px] h-[500px] bg-[#3B82F6]/15 bottom-20 -right-40"
          style={{ animationDelay: "-7s" }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-12 items-center">
            <div className="max-w-4xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4AE3C3]/10 border border-[#4AE3C3]/20 mb-8"
              >
                <Sparkles className="w-4 h-4 text-[#4AE3C3]" />
                <span className="text-sm font-medium text-[#4AE3C3]">{hero.badge}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.05] tracking-tight mb-6"
              >
                {hero.title}
                <br />
                <span className="text-gradient-teal">{hero.titleHighlight}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl md:text-2xl text-white/50 max-w-xl mb-10 leading-relaxed"
              >
                {hero.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-wrap gap-4"
              >
                <a href="#contact" className="btn-slush btn-slush-primary">
                  {hero.ctaPrimary}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#brands" className="btn-slush btn-slush-outline">
                  {hero.ctaSecondary}
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-white/10"
              >
                {[
                  { value: "100M+", label: "TikTok Views" },
                  { value: "#1", label: "Amazon New Release" },
                  { value: "3", label: "PB Brands Ready" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-white/40 text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#4AE3C3]/20 via-transparent to-[#3B82F6]/20 blur-2xl" />
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white/5">
                {renderHeroMedia(hero.heroMedia)}
              </div>
              <p className="text-xs text-white/40 mt-4">
                Update the hero media from the master page to swap images or videos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <Marquee />

      <section id="why" className="py-28 md:py-36 relative">
        <div className="glow-orb w-[500px] h-[500px] bg-[#4AE3C3]/10 top-1/4 -left-40" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <p className="text-[#4AE3C3] text-sm font-semibold tracking-widest uppercase mb-4">Why Stock Our Brands</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Pre-Sold <span className="text-gradient-teal">Products</span>
            </h2>
            <p className="text-white/40 text-lg max-w-lg mx-auto">
              Our products go viral before they hit your shelves. Built-in demand. Proven conversions.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: TrendingUp,
                title: "Viral on TikTok",
                desc: "100M+ organic views across our brands. Customers already searching for these products.",
              },
              {
                icon: Users,
                title: "Influencer Seeded",
                desc: "1000+ creators have reviewed our products. UGC library ready for your marketing.",
              },
              {
                icon: BarChart3,
                title: "Proven Sales",
                desc: "#1 Amazon rankings, TikTok Shop bestsellers. Track record of converting views to sales.",
              },
              {
                icon: Package,
                title: "Turnkey Supply",
                desc: "US warehouse ready. MOQ flexibility. Fast fulfillment from California.",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="card-slush p-6 h-full">
                  <item.icon className="w-8 h-8 text-[#4AE3C3] mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTAMarquee />

      <section id="brands" className="py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="text-[#4AE3C3] text-sm font-semibold tracking-widest uppercase mb-4">
              Available for Distribution
            </p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Our <span className="text-gradient-teal">PB Brands</span>
            </h2>
            <p className="text-white/40 text-lg max-w-md mx-auto">
              Viral K-Beauty brands ready to stock. Each with proven demand and sales track record.
            </p>
          </ScrollReveal>

          <BrandGrid />
        </div>
      </section>
    </div>
  )
}
