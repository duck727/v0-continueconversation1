"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { BrandGrid } from "@/components/brand-grid"
import { Marquee } from "@/components/marquee"
import { CTAMarquee } from "@/components/cta-marquee"
import { ScrollReveal } from "@/components/scroll-reveal"
import { HeroText } from "@/components/hero-text"
import { ArrowRight, Zap, Globe, TrendingUp, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030014]">
      <Navbar />

      {/* HERO Section - Slush style with floating orbs */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="gradient-orb w-[600px] h-[600px] bg-blue-500/30 top-[-200px] left-[-200px]" />
        <div
          className="gradient-orb w-[500px] h-[500px] bg-purple-500/20 bottom-[-100px] right-[-100px]"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="gradient-orb w-[400px] h-[400px] bg-cyan-500/20 top-[40%] right-[20%]"
          style={{ animationDelay: "-10s" }}
        />

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
          <div className="max-w-5xl">
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-8"
            >
              Where K-Trend Starts
            </motion.p>

            {/* Main headline */}
            <HeroText
              lines={["Build brands.", "Make them viral.", "Scale globally."]}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-8"
            />

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-xl md:text-2xl text-white/50 max-w-2xl mb-12 leading-relaxed"
            >
              EOEO transforms brands into viral sensations through TikTok-first marketing and global distribution.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#brands" className="btn-pill btn-pill-primary">
                View Our Brands
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#contact" className="btn-pill btn-pill-outline">
                Partner with Us
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-wrap gap-12 mt-20 pt-10 border-t border-white/10"
            >
              {[
                { value: "2017", label: "Founded in California" },
                { value: "180+", label: "Brand Partners" },
                { value: "100M+", label: "Total Views" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/40 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Band */}
      <Marquee />

      {/* PB BRANDS Section */}
      <section id="brands" className="py-32 md:py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-20">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-6">Our Portfolio</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Private <span className="text-gradient-blue">Brands</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Built for virality. Designed for scale. Ready for global markets.
            </p>
          </ScrollReveal>

          <BrandGrid />
        </div>
      </section>

      <CTAMarquee />

      {/* WHY EOEO Section - Slush style feature grid */}
      <section id="virality" className="py-32 md:py-40 relative overflow-hidden">
        {/* Background orb */}
        <div className="gradient-orb w-[800px] h-[800px] bg-blue-500/10 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left - Text content */}
            <ScrollReveal>
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-6">Why EOEO</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1]">
                Not ads.
                <br />
                <span className="text-gradient-blue">Virality.</span>
              </h2>
              <p className="text-xl text-white/50 mb-10 leading-relaxed">
                TikTok is our engine. We don't just distribute — we create cultural moments that drive conversion.
              </p>

              <div className="space-y-0">
                {[
                  "Creator seeding at scale",
                  "Viral-first creative testing",
                  "Fast iteration loops",
                  "Marketplace-ready execution",
                  "Global distribution mindset",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="feature-bullet"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Right - Feature cards */}
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { icon: Zap, title: "Viral Engine", desc: "TikTok-first content strategy" },
                  { icon: Globe, title: "Global Reach", desc: "US, LATAM & Asia markets" },
                  { icon: TrendingUp, title: "Proven Results", desc: "100M+ views generated" },
                  { icon: Users, title: "Creator Network", desc: "1000+ active influencers" },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="glass-card p-6 hover:scale-105 transition-transform duration-300"
                  >
                    <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/40 text-sm">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS / PROOF Section - Slush style */}
      <section className="py-32 md:py-40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-6">Don't Just Trust Us</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              See the <span className="text-gradient-blue">Results</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "MARSMADE's Castor Oil Shampoo Bar hit #1 New Release on Amazon within weeks of TikTok seeding.",
                metric: "#1",
                label: "Amazon New Release",
              },
              {
                quote: "CODE BRO generated 500K+ GMV in the first month through TikTok Shop alone.",
                metric: "500K+",
                label: "First Month GMV",
              },
              {
                quote: "Our viral campaigns have accumulated over 100M views across all brand content.",
                metric: "100M+",
                label: "Total Views",
              },
            ].map((item, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="review-card h-full flex flex-col">
                  <div className="text-5xl font-bold text-gradient-blue mb-2">{item.metric}</div>
                  <div className="text-white/40 text-sm uppercase tracking-wider mb-6">{item.label}</div>
                  <p className="text-white/70 leading-relaxed flex-grow">{item.quote}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTAMarquee />

      {/* CONTACT Section */}
      <section id="contact" className="py-32 md:py-40 relative overflow-hidden">
        {/* Background orbs */}
        <div className="gradient-orb w-[600px] h-[600px] bg-purple-500/20 top-0 right-[-200px]" />
        <div className="gradient-orb w-[500px] h-[500px] bg-blue-500/15 bottom-0 left-[-150px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="max-w-3xl mx-auto text-center">
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-6">Get Started</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1]">
              Let's build your
              <br />
              <span className="text-gradient-blue">viral brand.</span>
            </h2>
            <p className="text-white/50 text-xl mb-6">Partnership · Distribution · PB inquiries</p>
            <a
              href="mailto:contact@eoeo.company"
              className="text-white/40 hover:text-white transition-colors text-lg block mb-12"
            >
              contact@eoeo.company
            </a>

            <div className="flex flex-wrap gap-4 justify-center">
              <a href="mailto:contact@eoeo.company" className="btn-pill btn-pill-white">
                Contact EOEO
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#" className="btn-pill btn-pill-outline">
                Download Portfolio
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-white/60 text-sm">EOEO</span>
          </div>
          <p className="text-white/30 text-sm">© 2025 EOEO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
