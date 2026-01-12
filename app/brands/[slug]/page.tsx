import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { EditableImage } from "@/components/editable-image"

const brandData: Record<
  string,
  {
    name: string
    tagline: string
    oneLiner: string
    color: string
    image: string
    metrics: { label: string; value: string }[]
    skus: { name: string; description: string }[]
    channels: string[]
  }
> = {
  marsmade: {
    name: "MARSMADE",
    tagline: "Solid care. Zero waste.",
    oneLiner: "A bold solid-care brand proving performance on Amazon — built for sustainable, viral growth.",
    color: "from-emerald-500 to-teal-400",
    image: "/tiktok-dermafirm-eyebrow-beauty.jpg",
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
    color: "from-pink-500 to-rose-400",
    image: "/tiktok-reto-beauty-skincare-serum.jpg",
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
    color: "from-blue-500 to-indigo-400",
    image: "/tiktok-troubless-skincare-beauty-review.jpg",
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
    color: "from-purple-500 to-violet-400",
    image: "/tiktok-milk-touch-mascara-beauty.jpg",
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
    <div className="min-h-screen bg-[#030014] text-white">
      {/* Hero - Slush style with gradient accent */}
      <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div
          className={`gradient-orb w-[600px] h-[600px] bg-gradient-to-r ${brand.color} opacity-20 top-[-200px] left-[-200px]`}
        />
        <div
          className={`gradient-orb w-[500px] h-[500px] bg-gradient-to-r ${brand.color} opacity-15 bottom-[-100px] right-[-100px]`}
          style={{ animationDelay: "-5s" }}
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

          {/* Brand name with gradient underline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight">{brand.name}</h1>
          <div className={`w-32 h-1.5 mx-auto rounded-full bg-gradient-to-r ${brand.color} mb-8`} />

          <p className="text-2xl md:text-3xl text-white/70 font-medium mb-4">{brand.tagline}</p>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-14 leading-relaxed">{brand.oneLiner}</p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:contact@eoeo.company" className="btn-pill btn-pill-white">
              Contact EOEO
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link href="/" className="btn-pill btn-pill-outline">
              View All Brands
            </Link>
          </div>

          <div className="mt-12 flex justify-center">
            <EditableImage
              storageKey={`brand-hero-image-${slug}`}
              defaultSrc={brand.image}
              alt={`${brand.name} hero`}
              className="w-full max-w-4xl"
              imageClassName="h-[240px] md:h-[320px]"
            />
          </div>
        </div>
      </section>

      {/* Key Proof / Metrics - Glass cards */}
      <section className="py-28 md:py-36 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-12">Key Proof</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brand.metrics.map((metric, index) => (
              <div key={metric.label} className="metric-card-slush" style={{ animationDelay: `${index * 0.1}s` }}>
                <div
                  className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${brand.color} bg-clip-text text-transparent mb-2`}
                >
                  {metric.value}
                </div>
                <div className="text-white/40 text-xs uppercase tracking-wider">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero SKUs - Slush style cards */}
      <section className="py-28 md:py-36 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-12">Hero SKUs</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {brand.skus.map((sku) => (
              <div key={sku.name} className="sku-card-slush group">
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-gradient-blue transition-colors">
                  {sku.name}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{sku.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channels / Markets - Pills */}
      <section className="py-28 md:py-36 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-12">Channels & Markets</p>
          <div className="flex flex-wrap gap-4">
            {brand.channels.map((channel) => (
              <span
                key={channel}
                className={`px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-white/70 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white transition-all duration-300`}
              >
                {channel}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">Interested in {brand.name}?</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:contact@eoeo.company" className="btn-pill btn-pill-primary">
              Contact EOEO
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link href="/" className="btn-pill btn-pill-outline">
              <ArrowLeft className="w-4 h-4" />
              Back to EOEO
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
