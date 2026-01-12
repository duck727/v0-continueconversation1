"use client"

export function Marquee() {
  const items = [
    "Where K-trend starts",
    "180+ Brand Partners",
    "100M+ Views",
    "TikTok Viral Engine",
    "Global Distribution",
  ]

  return (
    <div className="marquee-container">
      <div className="marquee-track">
        {[...Array(4)].map((_, setIndex) =>
          items.map((item, i) => (
            <div key={`${setIndex}-${i}`} className="marquee-item text-white">
              <span>{item}</span>
              <span className="text-white/60">✦</span>
            </div>
          )),
        )}
      </div>
    </div>
  )
}
