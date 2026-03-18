export default function Home() {
  return (
    <main className="min-h-screen bg-[#d7e2ff] text-slate-900">
      <section className="mx-auto flex min-h-[768px] max-w-[1366px] items-center justify-center px-6 py-20">
        <div className="font-telegraf text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-600 sm:text-sm">
            EOEO Distribution
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Stock the Next Trend.
          </h1>
          <p className="mt-6 text-base text-slate-600 sm:text-lg">
            Our PB brands are already viral on TikTok.
            <br className="hidden sm:block" />
            Now they&apos;re ready for your shelves.
            <br className="hidden sm:block" />
            Partner with EOEO to distribute proven K-Beauty winners.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              className="inline-flex items-center justify-center rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white"
              href="https://egongegong.com"
            >
              Explore Partnership
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
