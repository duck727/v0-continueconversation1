import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

const brandData: Record<
  string,
  {
    name: string
    tagline: string
    oneLiner: string
    color: string
    metrics: { label: string; value: string }[]
    skus: { name: string; description: string }[]
    channels: string[]
  }
> = {
  marsmade: {
    name: "MARSMADE",
    tagline: "Solid care. Zero waste.",
    oneLiner: "A bold solid-care brand proving performance on Amazon — built for sustainable, viral growth.",
    color: "#4AE3C3",
    metrics: [
      { label: "Views (2025)", value: "100M+" },
      { label: "Hair Shampoo", value: "#1 New Release" },
      { label: "Category Rank", value: "Top #5" },
      { label: "Amazon Rating", value: "4.7★" },
      { label: "Eco Impact", value: "1 bar = 2-3 bottles" },
      { label: "Packaging", value: "Zero plastic" },
    ],
    skus: [
      { name: "Castor Oil Shampoo Bar", description: "Moisturize & strengthen hair and scalp." },
      { name: "Rosemary Shampoo Bar", description: "Refresh scalp & support fuller-looking hair." },
      { name: "Tea Tree Shampoo Bar", description: "Purify & balance scalp." },
      { name: "Rice Water Shampoo Bar", description: "Strengthen & improve elasticity." },
      { name: "Castor Oil Conditioner Bar", description: "Nourish, detangle, enhance shine." },
      { name: "PLA Mesh Saver", description: "Keep bars dry & long-lasting." },
    ],
    channels: ["Amazon.com", "DTC Website", "TikTok Shop"],
  },
  kiero: {
    name: "KIERO",
    tagline: "Practical, sensible, effective.",
    oneLiner: "K-Beauty science meets LATAM energy — built for everyday routines and creator-led growth.",
    color: "#EC4899",
    metrics: [
      { label: "Launch", value: "Mexico EBS" },
      { label: "Strategy", value: "TikTok Seeding" },
      { label: "Concept", value: "5-Step Routine" },
      { label: "Status", value: "Creator Ready" },
    ],
    skus: [
      { name: "Calm Enzyme Cleanser", description: "Gentle cleanse for daily routines." },
      { name: "Airy Sun Stick", description: "Easy re-application, on-the-go UV care." },
      { name: "Prime Sun Gel", description: "Lightweight daily sun protection." },
      { name: "Centella Boost Serum", description: "Calm & hydrate for everyday recovery." },
      { name: "Hydrating Eye Cream", description: "Daily moisture for the eye area." },
    ],
    channels: ["LATAM Retail", "TikTok Shop", "Global Expansion"],
  },
  "code-bro": {
    name: "CODE BRO",
    tagline: "Men's grooming, leveled up.",
    oneLiner: "Modern men's personal care brand with bold branding and effective formulas — built for conversion.",
    color: "#3B82F6",
    metrics: [
      { label: "First Month GMV", value: "500K+" },
      { label: "SKUs", value: "8" },
      { label: "Market", value: "US" },
      { label: "Focus", value: "Men's Care" },
    ],
    skus: [
      { name: "MORNING WOOD", description: "Energizing morning face wash." },
      { name: "FRENCH BALLDOG", description: "Cooling body wash." },
      { name: "CLEAN BEANS", description: "Intimate care for men." },
      { name: "WOOD MORNING", description: "PM recovery face wash." },
      { name: "DOWN UNDER", description: "Below-the-belt powder." },
    ],
    channels: ["Amazon US", "TikTok Shop US"],
  },
  "404-lab": {
    name: "404 LAB",
    tagline: "Trend-first beauty.",
    oneLiner: "Experimental beauty collection for the modern consumer — designed for viral moments.",
    color: "#A855F7",
    metrics: [
      { label: "Status", value: "In Development" },
      { label: "Focus", value: "Gen-Z Beauty" },
      { label: "Strategy", value: "Trend-First" },
      { label: "Launch", value: "2025" },
    ],
    skus: [{ name: "Coming Soon", description: "Product lineup in development." }],
    channels: ["TBD"],
  },
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const brand = brandData[slug]

  if (!brand) {
    notFound()
  }

  return (
    <div className="min-h-screen slush-bg text-white">
      {/* Hero */}
      <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        {/* Glow orbs with brand color */}
        <div className="glow-orb w-[600px] h-[600px] -top-40 -left-40" style={{ background: `${brand.color}30` }} />
        <div
          className="glow-orb w-[500px] h-[500px] bottom-0 -right-40"
          style={{ background: `${brand.color}20`, animationDelay: "-7s" }}
        />

        <div className="max-w-7xl mx-auto px-6 py-32 text-center relative z-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to EOEO
          </Link>

          <p className="text-sm text-white/40 uppercase tracking-[0.2em] mb-8">EOEO Private Brand</p>

          {/* Brand name */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight">{brand.name}</h1>

          {/* Brand color accent line */}
          <div className="w-24 h-1 mx-auto rounded-full mb-8" style={{ background: brand.color }} />

          <p className="text-2xl md:text-3xl text-white/70 font-medium mb-4">{brand.tagline}</p>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-14 leading-relaxed">{brand.oneLiner}</p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:contact@eoeo.company" className="btn-slush btn-slush-white">
              Contact EOEO
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link href="/" className="btn-slush btn-slush-outline">
              View All Brands
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm font-semibold tracking-widest uppercase mb-10" style={{ color: brand.color }}>
            Key Proof
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brand.metrics.map((metric) => (
              <div key={metric.label} className="card-slush p-5 text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: brand.color }}>
                  {metric.value}
                </div>
                <div className="text-white/40 text-xs uppercase tracking-wider">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKUs */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm font-semibold tracking-widest uppercase mb-10" style={{ color: brand.color }}>
            Hero SKUs
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brand.skus.map((sku) => (
              <div key={sku.name} className="card-slush p-6 group">
                <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-[#4AE3C3] transition-colors">
                  {sku.name}
                </h3>
                <p className="text-white/40 text-sm">{sku.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm font-semibold tracking-widest uppercase mb-10" style={{ color: brand.color }}>
            Channels & Markets
          </p>
          <div className="flex flex-wrap gap-3">
            {brand.channels.map((channel) => (
              <span
                key={channel}
                className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/70 hover:border-[#4AE3C3]/50 hover:text-white transition-all"
              >
                {channel}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">Interested in {brand.name}?</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:contact@eoeo.company"
              className="btn-slush"
              style={{ background: brand.color, color: "#030014" }}
            >
              Contact EOEO
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link href="/" className="btn-slush btn-slush-outline">
              <ArrowLeft className="w-4 h-4" />
              Back to EOEO
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
