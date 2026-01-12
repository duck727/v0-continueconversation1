"use client"

import { useEffect, useMemo, useState } from "react"
import type { BrandContent, SiteContent } from "@/lib/content"

const providerLabels: Record<SiteContent["storage"]["provider"], string> = {
  local: "Local uploads (/public/uploads)",
  manual: "Manual URL (no upload)",
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

const parseList = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean)

export default function MasterPage() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/admin/content")
      const data = (await response.json()) as SiteContent
      setContent(data)
    }

    void load()
  }, [])

  const storageProvider = content?.storage.provider ?? "local"

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

  const updateBrandMedia = (
    slug: string,
    field: keyof NonNullable<BrandContent["heroMedia"]>,
    value: string,
  ) => {
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
    setMessage(response.ok ? "Saved changes." : "Failed to save changes.")
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
    return data.url ?? ""
  }

  if (!content) {
    return (
      <div className="min-h-screen slush-bg text-white flex items-center justify-center">Loading content...</div>
    )
  }

  return (
    <div className="min-h-screen slush-bg text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">Master Page</p>
          <h1 className="text-4xl md:text-5xl font-semibold">Main + Brand Content Control</h1>
          <p className="text-white/50">
            Manage hero visuals, copy, and brand details. Updates write to <code>data/site-content.json</code>.
          </p>
        </header>

        <section className="card-slush p-6 space-y-4">
          <h2 className="text-xl font-semibold">Storage Provider</h2>
          <p className="text-sm text-white/50">
            Choose where uploads go. Local uploads are quick for previews, while production should use a durable
            object store.
          </p>
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

        <section className="card-slush p-6 space-y-6">
          <h2 className="text-xl font-semibold">Homepage Hero</h2>
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
                <label className="text-sm text-white/60">Title line</label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                  value={content.home.hero.title}
                  onChange={(event) => updateHome("title", event.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-white/60">Title highlight</label>
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
                <label className="text-sm text-white/60">Hero media type</label>
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
                <label className="text-sm text-white/60">Hero media URL</label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                  value={content.home.hero.heroMedia?.url ?? ""}
                  onChange={(event) => updateHomeMedia("url", event.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-white/60">Alt text</label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                  value={content.home.hero.heroMedia?.alt ?? ""}
                  onChange={(event) => updateHomeMedia("alt", event.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-white/60">Poster (video)</label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                  value={content.home.hero.heroMedia?.poster ?? ""}
                  onChange={(event) => updateHomeMedia("poster", event.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-white/60">Upload file</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
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
                {uploading ? <p className="text-xs text-white/40 mt-2">Uploading...</p> : null}
                {storageProvider === "manual" ? (
                  <p className="text-xs text-white/40 mt-2">Manual storage selected. Paste a URL instead.</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Brand Pages</h2>
          <div className="space-y-8">
            {brandEntries.map(([slug, brand]) => (
              <div key={slug} className="card-slush p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{brand.name}</h3>
                    <p className="text-xs text-white/40">Slug: {slug}</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-white/60">Brand name</label>
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
                      <label className="text-sm text-white/60">One-liner</label>
                      <textarea
                        rows={2}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={brand.oneLiner}
                        onChange={(event) => updateBrand(slug, "oneLiner", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Brand color</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={brand.color}
                        onChange={(event) => updateBrand(slug, "color", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Metrics (Label | Value)</label>
                      <textarea
                        rows={5}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={formatPairs(brand.metrics)}
                        onChange={(event) => updateBrand(slug, "metrics", parsePairs(event.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-white/60">Hero media type</label>
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
                      <label className="text-sm text-white/60">Hero media URL</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={brand.heroMedia?.url ?? ""}
                        onChange={(event) => updateBrandMedia(slug, "url", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Alt text</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={brand.heroMedia?.alt ?? ""}
                        onChange={(event) => updateBrandMedia(slug, "alt", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Poster (video)</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={brand.heroMedia?.poster ?? ""}
                        onChange={(event) => updateBrandMedia(slug, "poster", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Upload file</label>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
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
                      {storageProvider === "manual" ? (
                        <p className="text-xs text-white/40 mt-2">Manual storage selected. Paste a URL instead.</p>
                      ) : null}
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Hero SKUs (Name | Description)</label>
                      <textarea
                        rows={5}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={formatSkus(brand.skus)}
                        onChange={(event) => updateBrand(slug, "skus", parseSkus(event.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Channels (one per line)</label>
                      <textarea
                        rows={4}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                        value={formatList(brand.channels)}
                        onChange={(event) => updateBrand(slug, "channels", parseList(event.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button className="btn-slush btn-slush-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {message ? <p className="text-sm text-white/50">{message}</p> : null}
        </div>
      </div>
    </div>
  )
}
