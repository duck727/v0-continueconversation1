"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { BrandContent, SiteContent } from "@/lib/content"

const providerLabels: Record<SiteContent["storage"]["provider"], string> = {
  local: "Local uploads (/public/uploads)",
  manual: "Manual URL (no upload)",
  blob: "Vercel Blob (Recommended)",
}

const formatPairs = (pairs: { label: string; value: string }[]) =>
  pairs.map((pair) => `${pair.label} | ${pair.value}`).join("\n")

const formatSkus = (skus: { name: string; description: string }[]) =>
  skus.map((sku) => `${sku.name} | ${sku.description}`).join("\n")

const formatList = (items: string[]) => items.join("\n")

const parsePairs = (value: string) =>
  value
    .split("\n")
    .map((line) => line.split("|").map((segment) => segment.trim()))
    .filter((line) => line.length >= 2 && line[0] && line[1])
    .map(([label, val]) => ({ label, value: val }))

const parseSkus = (value: string) =>
  value
    .split("\n")
    .map((line) => line.split("|").map((segment) => segment.trim()))
    .filter((line) => line.length >= 2 && line[0] && line[1])
    .map(([name, description]) => ({ name, description }))

const parseList = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

export default function MasterPage() {
  const router = useRouter()
  const [content, setContent] = useState<SiteContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<"home" | "brands">("home")

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/admin/content")
      if (response.status === 401) {
        router.push("/master/login")
        return
      }
      const data = (await response.json()) as SiteContent
      setContent(data)
    }

    void load()
  }, [router])

  const storageProvider = content?.storage.provider ?? "blob"

  const brandEntries = useMemo(() => {
    if (!content) return [] as [string, BrandContent][]
    return Object.entries(content.brands)
  }, [content])

  const updateHome = (field: keyof SiteContent["home"]["hero"], value: string) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            home: {
              ...prev.home,
              hero: {
                ...prev.home.hero,
                [field]: value,
              },
            },
          }
        : prev,
    )
  }

  const updateHomeMedia = (field: keyof NonNullable<SiteContent["home"]["hero"]["heroMedia"]>, value: string) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            home: {
              ...prev.home,
              hero: {
                ...prev.home.hero,
                heroMedia: {
                  type: "image",
                  url: "",
                  ...prev.home.hero.heroMedia,
                  [field]: value,
                },
              },
            },
          }
        : prev,
    )
  }

  const updateBrand = (slug: string, field: keyof BrandContent, value: BrandContent[keyof BrandContent]) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            brands: {
              ...prev.brands,
              [slug]: {
                ...prev.brands[slug],
                [field]: value,
              },
            },
          }
        : prev,
    )
  }

  const updateBrandMedia = (slug: string, field: keyof NonNullable<BrandContent["heroMedia"]>, value: string) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            brands: {
              ...prev.brands,
              [slug]: {
                ...prev.brands[slug],
                heroMedia: {
                  type: "image",
                  url: "",
                  ...prev.brands[slug].heroMedia,
                  [field]: value,
                },
              },
            },
          }
        : prev,
    )
  }

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    setMessage(null)

    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    })

    setSaving(false)
    setMessage(response.ok ? "Changes saved successfully!" : "Failed to save changes.")

    if (response.ok) {
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const uploadFile = async (file: File) => {
    if (storageProvider === "manual") {
      setMessage("Manual storage selected. Paste a URL instead of uploading.")
      return ""
    }

    setUploading(true)
    setMessage(null)
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`/api/uploads?provider=${storageProvider}`, {
      method: "POST",
      body: formData,
    })

    setUploading(false)

    if (!response.ok) {
      setMessage("Upload failed. Check storage credentials.")
      return ""
    }

    const data = (await response.json()) as { url?: string }
    setMessage("File uploaded successfully!")
    setTimeout(() => setMessage(null), 3000)
    return data.url ?? ""
  }

  const handleLogout = async () => {
    document.cookie = "master_auth=; path=/; max-age=0"
    router.push("/master/login")
  }

  if (!content) {
    return (
      <div className="min-h-screen slush-bg text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen slush-bg text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">EOEO Master CMS</h1>
            <p className="text-xs text-white/40">Content Management System</p>
          </div>
          <div className="flex items-center gap-4">
            {message && (
              <span
                className={`text-sm ${message.includes("success") || message.includes("saved") ? "text-teal-400" : "text-red-400"}`}
              >
                {message}
              </span>
            )}
            <button onClick={handleSave} disabled={saving} className="btn-slush btn-slush-primary px-6 py-2 text-sm">
              {saving ? "Saving..." : "Save All Changes"}
            </button>
            <button onClick={handleLogout} className="text-sm text-white/50 hover:text-white transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16 space-y-8">
        {/* Storage Provider */}
        <section className="card-slush p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-400 rounded-full" />
            Storage Provider
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/60">Provider</label>
              <select
                value={content.storage.provider}
                onChange={(event) =>
                  setContent((prev) =>
                    prev
                      ? {
                          ...prev,
                          storage: {
                            ...prev.storage,
                            provider: event.target.value as SiteContent["storage"]["provider"],
                          },
                        }
                      : prev,
                  )
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              >
                {Object.entries(providerLabels).map(([value, label]) => (
                  <option key={value} value={value} className="bg-black">
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-white/60">Notes</label>
              <textarea
                value={content.storage.note ?? ""}
                onChange={(event) =>
                  setContent((prev) =>
                    prev
                      ? {
                          ...prev,
                          storage: { ...prev.storage, note: event.target.value },
                        }
                      : prev,
                  )
                }
                rows={3}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "home" ? "bg-teal-500 text-black" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Homepage
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "brands" ? "bg-teal-500 text-black" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Brand Pages ({brandEntries.length})
          </button>
        </div>

        {/* Homepage Tab */}
        {activeTab === "home" && (
          <section className="card-slush p-6 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-400 rounded-full" />
              Homepage Hero
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60">Badge</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                    value={content.home.hero.badge}
                    onChange={(event) => updateHome("badge", event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60">Title</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                    value={content.home.hero.title}
                    onChange={(event) => updateHome("title", event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60">Title Highlight (gradient text)</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                    value={content.home.hero.titleHighlight}
                    onChange={(event) => updateHome("titleHighlight", event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60">Subtitle</label>
                  <textarea
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                    value={content.home.hero.subtitle}
                    onChange={(event) => updateHome("subtitle", event.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white/60">Primary CTA</label>
                    <input
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                      value={content.home.hero.ctaPrimary}
                      onChange={(event) => updateHome("ctaPrimary", event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/60">Secondary CTA</label>
                    <input
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                      value={content.home.hero.ctaSecondary}
                      onChange={(event) => updateHome("ctaSecondary", event.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60">Hero Media Type</label>
                  <select
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                    value={content.home.hero.heroMedia?.type ?? "image"}
                    onChange={(event) => updateHomeMedia("type", event.target.value)}
                  >
                    <option value="image" className="bg-black">
                      Image
                    </option>
                    <option value="video" className="bg-black">
                      Video
                    </option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60">Hero Media URL</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                    value={content.home.hero.heroMedia?.url ?? ""}
                    onChange={(event) => updateHomeMedia("url", event.target.value)}
                    placeholder="https://..."
                  />
                </div>
                {content.home.hero.heroMedia?.url && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-white/10">
                    {content.home.hero.heroMedia.type === "video" ? (
                      <video src={content.home.hero.heroMedia.url} className="w-full h-40 object-cover" controls />
                    ) : (
                      <img
                        src={content.home.hero.heroMedia.url || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                      />
                    )}
                  </div>
                )}
                <div>
                  <label className="text-sm text-white/60">Alt Text</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                    value={content.home.hero.heroMedia?.alt ?? ""}
                    onChange={(event) => updateHomeMedia("alt", event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60">Upload File</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-teal-500 file:text-black hover:file:bg-teal-400"
                    onChange={async (event) => {
                      const file = event.target.files?.[0]
                      if (!file) return
                      const url = await uploadFile(file)
                      if (url) {
                        updateHomeMedia("url", url)
                      }
                    }}
                    disabled={uploading || storageProvider === "manual"}
                  />
                  {uploading && <p className="text-xs text-teal-400 mt-2">Uploading...</p>}
                  {storageProvider === "manual" && (
                    <p className="text-xs text-white/40 mt-2">Manual storage selected. Paste a URL instead.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Brands Tab */}
        {activeTab === "brands" && (
          <div className="space-y-6">
            {brandEntries.map(([slug, brand]) => (
              <section key={slug} className="card-slush p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brand.color }} />
                    <div>
                      <h3 className="text-lg font-semibold">{brand.name}</h3>
                      <p className="text-xs text-white/40">/{slug}</p>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-white/60">Brand Name</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={brand.name}
                        onChange={(event) => updateBrand(slug, "name", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Tagline</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={brand.tagline}
                        onChange={(event) => updateBrand(slug, "tagline", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60">One-liner Description</label>
                      <textarea
                        rows={2}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={brand.oneLiner}
                        onChange={(event) => updateBrand(slug, "oneLiner", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Brand Color (hex)</label>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="color"
                          value={brand.color}
                          onChange={(event) => updateBrand(slug, "color", event.target.value)}
                          className="w-12 h-12 rounded-xl border border-white/10 bg-black/40 cursor-pointer"
                        />
                        <input
                          className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                          value={brand.color}
                          onChange={(event) => updateBrand(slug, "color", event.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Metrics (Label | Value per line)</label>
                      <textarea
                        rows={4}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white font-mono"
                        value={formatPairs(brand.metrics)}
                        onChange={(event) => updateBrand(slug, "metrics", parsePairs(event.target.value))}
                        placeholder="SKUs | 8&#10;TikTok Views | 50M+"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-white/60">Hero Media Type</label>
                      <select
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={brand.heroMedia?.type ?? "image"}
                        onChange={(event) => updateBrandMedia(slug, "type", event.target.value)}
                      >
                        <option value="image" className="bg-black">
                          Image
                        </option>
                        <option value="video" className="bg-black">
                          Video
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Hero Media URL</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={brand.heroMedia?.url ?? ""}
                        onChange={(event) => updateBrandMedia(slug, "url", event.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    {brand.heroMedia?.url && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-white/10">
                        {brand.heroMedia.type === "video" ? (
                          <video src={brand.heroMedia.url} className="w-full h-32 object-cover" controls />
                        ) : (
                          <img
                            src={brand.heroMedia.url || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-32 object-cover"
                          />
                        )}
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-white/60">Upload File</label>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-teal-500 file:text-black hover:file:bg-teal-400"
                        onChange={async (event) => {
                          const file = event.target.files?.[0]
                          if (!file) return
                          const url = await uploadFile(file)
                          if (url) {
                            updateBrandMedia(slug, "url", url)
                          }
                        }}
                        disabled={uploading || storageProvider === "manual"}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60">SKUs (Name | Description per line)</label>
                      <textarea
                        rows={4}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white font-mono"
                        value={formatSkus(brand.skus)}
                        onChange={(event) => updateBrand(slug, "skus", parseSkus(event.target.value))}
                        placeholder="Product Name | Description"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Sales Channels (one per line)</label>
                      <textarea
                        rows={3}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white font-mono"
                        value={formatList(brand.channels)}
                        onChange={(event) => updateBrand(slug, "channels", parseList(event.target.value))}
                        placeholder="Amazon&#10;TikTok Shop&#10;Walmart"
                      />
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
