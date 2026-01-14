import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getSiteContent } from "@/lib/content"

const renderHeroMedia = (media?: { type: "image" | "video"; url: string; alt?: string; poster?: string }) => {
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
      src={media.url || "/placeholder.svg"}
      alt={media.alt ?? "Brand hero visual"}
    />
  )
}

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const content = await getSiteContent()
  const brand = content.brands[slug]

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
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">{brand.oneLiner}</p>

          {brand.heroMedia?.url ? (
            <div className="max-w-3xl mx-auto mb-14">
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-white/5">
                {renderHeroMedia(brand.heroMedia)}
              </div>
              <p className="text-xs text-white/40 mt-4">
                Swap this hero media from the master page to keep brand visuals current.
              </p>
            </div>
          ) : null}

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
