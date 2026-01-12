"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { BrandGrid } from "@/components/brand-grid"
import { Marquee } from "@/components/marquee"
import { CTAMarquee } from "@/components/cta-marquee"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ArrowRight, Sparkles, TrendingUp, Users, Package, BarChart3 } from "lucide-react"

export default function Home() {
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
          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4AE3C3]/10 border border-[#4AE3C3]/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-[#4AE3C3]" />
              <span className="text-sm font-medium text-[#4AE3C3]">Viral-Proven K-Beauty Brands</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.05] tracking-tight mb-6"
            >
              Stock the
              <br />
              <span className="text-gradient-teal">Next Trend.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-white/50 max-w-xl mb-10 leading-relaxed"
            >
              Our PB brands are already viral on TikTok. Now they're ready for your shelves. Partner with EOEO to
              distribute proven K-Beauty winners.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#contact" className="btn-slush btn-slush-primary">
                Become a Distributor
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#brands" className="btn-slush btn-slush-outline">
                View Our Brands
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

      <section className="py-28 md:py-36 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-14">
            <p className="text-[#4AE3C3] text-sm font-semibold tracking-widest uppercase mb-4">Track Record</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Why Buyers <span className="text-gradient-teal">Trust Us</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                metric: "#1",
                label: "Amazon Ranking",
                desc: "MARSMADE Castor Oil Shampoo Bar hit #1 New Release in Hair Care category",
              },
              {
                metric: "$500K+",
                label: "First Month GMV",
                desc: "CODE BRO TikTok Shop launch generated half a million in 30 days",
              },
              {
                metric: "2.8M",
                label: "Single Video Views",
                desc: "Organic creator content driving massive brand awareness",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="review-card h-full">
                  <div className="text-4xl font-bold text-gradient-teal mb-2">{item.metric}</div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-4">{item.label}</div>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTAMarquee />

      <section id="contact" className="py-28 md:py-36 relative">
        <div className="glow-orb w-[500px] h-[500px] bg-[#4AE3C3]/15 top-0 right-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="max-w-2xl mx-auto text-center">
            <p className="text-[#4AE3C3] text-sm font-semibold tracking-widest uppercase mb-4">Stock Our Brands</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to
              <br />
              <span className="text-gradient-teal">Distribute?</span>
            </h2>
            <p className="text-white/40 text-lg mb-2">
              Looking for retail partners, distributors, and resellers worldwide.
            </p>
            <p className="text-white/50 text-base mb-8">
              MOQ flexibility available. US warehouse ready for fast fulfillment.
            </p>

            <a
              href="mailto:globalsales2@egongegong.com"
              className="text-[#4AE3C3] hover:text-[#6FECD4] transition-colors mb-10 block text-lg font-medium"
            >
              globalsales2@egongegong.com
            </a>

            <div className="flex flex-wrap gap-4 justify-center">
              <a href="mailto:globalsales2@egongegong.com" className="btn-slush btn-slush-primary">
                Request Product Catalog
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="tel:+82-2-2135-4998" className="btn-slush btn-slush-outline">
                +82-2-2135-4998
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#4AE3C3] flex items-center justify-center">
              <span className="text-[#030014] font-bold text-xs">E</span>
            </div>
            <span className="text-white/60 text-sm">EGONGEGONG</span>
          </div>
          <p className="text-white/30 text-sm">© 2025 EGONGEGONG. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
