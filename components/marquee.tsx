"use client"

export function Marquee() {
  const items = [
    "Viral K-Beauty Brands",
    "Ready to Stock",
    "#1 Amazon Rankings",
    "100M+ TikTok Views",
    "US Warehouse Ready",
    "Flexible MOQ",
  ]

  return (
    <div className="marquee-slush overflow-hidden">
      <div className="marquee-track">
        {[...Array(4)].map((_, setIndex) =>
          items.map((item, i) => (
            <div
              key={`${setIndex}-${i}`}
              className="flex items-center gap-8 px-8 text-[#030014] font-semibold text-sm tracking-wide whitespace-nowrap"
            >
              <span>{item}</span>
              <span className="text-[#030014]/40">✦</span>
            </div>
          )),
        )}
      </div>
    </div>
  )
}
