"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { BrandContent, SiteContent } from "@/lib/content"

const providerLabels: Record<SiteContent["storage"]["provider"], string> = {
  local: "Local uploads (/public/uploads)",
  manual: "Manual URL (no upload)",
}

const emptyMetric = () => ({ label: "", value: "" })
const emptySku = () => ({ name: "", description: "" })

export default function MasterPage() {
  const router = useRouter()
  const [content, setContent] = useState<SiteContent | null>(null)
  const [initialContent, setInitialContent] = useState<SiteContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/admin/content")
        if (response.status === 401) {
          router.replace("/master/login")
          return
        }
        if (!response.ok) {
          const error = (await response.json()) as { error?: string }
          setErrorMessage(error.error ?? "콘텐츠를 불러오지 못했습니다.")
          return
        }
        const data = (await response.json()) as SiteContent
        setContent(data)
        setInitialContent(data)
        setErrorMessage(null)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "콘텐츠를 불러오지 못했습니다.")
      }
    }

    void load()
  }, [router])

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

  const updateBrandMetric = (slug: string, index: number, field: "label" | "value", value: string) => {
    setContent((prev) => {
      if (!prev) return prev
      const metrics = [...prev.brands[slug].metrics]
      metrics[index] = { ...metrics[index], [field]: value }
      return {
        ...prev,
        brands: {
          ...prev.brands,
          [slug]: {
            ...prev.brands[slug],
            metrics,
          },
        },
      }
    })
  }

  const addBrandMetric = (slug: string) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            brands: {
              ...prev.brands,
              [slug]: {
                ...prev.brands[slug],
                metrics: [...prev.brands[slug].metrics, emptyMetric()],
              },
            },
          }
        : prev,
    )
  }

  const removeBrandMetric = (slug: string, index: number) => {
    setContent((prev) => {
      if (!prev) return prev
      const metrics = prev.brands[slug].metrics.filter((_, metricIndex) => metricIndex !== index)
      return {
        ...prev,
        brands: {
          ...prev.brands,
          [slug]: {
            ...prev.brands[slug],
            metrics,
          },
        },
      }
    })
  }

  const updateBrandSku = (slug: string, index: number, field: "name" | "description", value: string) => {
    setContent((prev) => {
      if (!prev) return prev
      const skus = [...prev.brands[slug].skus]
      skus[index] = { ...skus[index], [field]: value }
      return {
        ...prev,
        brands: {
          ...prev.brands,
          [slug]: {
            ...prev.brands[slug],
            skus,
          },
        },
      }
    })
  }

  const addBrandSku = (slug: string) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            brands: {
              ...prev.brands,
              [slug]: {
                ...prev.brands[slug],
                skus: [...prev.brands[slug].skus, emptySku()],
              },
            },
          }
        : prev,
    )
  }

  const removeBrandSku = (slug: string, index: number) => {
    setContent((prev) => {
      if (!prev) return prev
      const skus = prev.brands[slug].skus.filter((_, skuIndex) => skuIndex !== index)
      return {
        ...prev,
        brands: {
          ...prev.brands,
          [slug]: {
            ...prev.brands[slug],
            skus,
          },
        },
      }
    })
  }

  const updateBrandChannel = (slug: string, index: number, value: string) => {
    setContent((prev) => {
      if (!prev) return prev
      const channels = [...prev.brands[slug].channels]
      channels[index] = value
      return {
        ...prev,
        brands: {
          ...prev.brands,
          [slug]: {
            ...prev.brands[slug],
            channels,
          },
        },
      }
    })
  }

  const addBrandChannel = (slug: string) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            brands: {
              ...prev.brands,
              [slug]: {
                ...prev.brands[slug],
                channels: [...prev.brands[slug].channels, ""],
              },
            },
          }
        : prev,
    )
  }

  const removeBrandChannel = (slug: string, index: number) => {
    setContent((prev) => {
      if (!prev) return prev
      const channels = prev.brands[slug].channels.filter((_, channelIndex) => channelIndex !== index)
      return {
        ...prev,
        brands: {
          ...prev.brands,
          [slug]: {
            ...prev.brands[slug],
            channels,
          },
        },
      }
    })
  }

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    setMessage(null)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })

      if (response.status === 401) {
        router.replace("/master/login")
        return
      }

      if (!response.ok) {
        const error = (await response.json()) as { error?: string }
        setErrorMessage(error.error ?? "저장에 실패했습니다. 스토리지/권한을 확인해주세요.")
        return
      }

      setInitialContent(content)
      setLastSavedAt(new Date().toLocaleString("ko-KR"))
      setMessage("변경사항을 저장했습니다.")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "저장에 실패했습니다.")
    } finally {
      setSaving(false)
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
      setErrorMessage("업로드에 실패했습니다. 스토리지 설정을 확인해주세요.")
      return ""
    }

    const data = (await response.json()) as { url?: string }
    return data.url ?? ""
  }

  const hasChanges = useMemo(() => {
    if (!content || !initialContent) return false
    return JSON.stringify(content) !== JSON.stringify(initialContent)
  }, [content, initialContent])

  const renderMediaPreview = (media?: { type: "image" | "video"; url: string; alt?: string; poster?: string }) => {
    if (!media?.url) return null
    if (media.type === "video") {
      return (
        <video
          className="mt-3 w-full rounded-xl border border-white/10 bg-black/40"
          src={media.url}
          poster={media.poster}
          controls
        />
      )
    }
    return (
      <img
        className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 object-cover"
        src={media.url}
        alt={media.alt ?? "media preview"}
      />
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen slush-bg text-white flex items-center justify-center">
        {errorMessage ?? "Loading content..."}
      </div>
    )
  }

  return (
    <div className="min-h-screen slush-bg text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">Master Page</p>
          <h1 className="text-4xl md:text-5xl font-semibold">Main + Brand Content Control</h1>
          <p className="text-white/50">코드를 몰라도 편하게 수정할 수 있도록 단계별 입력 UI를 제공합니다.</p>
        </header>

        <section className="card-slush p-6 space-y-4">
          <h2 className="text-xl font-semibold">진행 상태</h2>
          <div className="grid gap-3 md:grid-cols-3 text-sm text-white/60">
            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
              <p className="text-xs uppercase text-white/40">변경사항</p>
              <p className="text-base text-white">{hasChanges ? "저장되지 않음" : "저장됨"}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
              <p className="text-xs uppercase text-white/40">최근 저장</p>
              <p className="text-base text-white">{lastSavedAt ?? "아직 저장 전"}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
              <p className="text-xs uppercase text-white/40">스토리지</p>
              <p className="text-base text-white">{providerLabels[storageProvider]}</p>
            </div>
          </div>
          {errorMessage ? (
            <p className="text-sm text-red-300">오류: {errorMessage}</p>
          ) : message ? (
            <p className="text-sm text-emerald-300">{message}</p>
          ) : null}
        </section>

        <section className="card-slush p-6 space-y-4">
          <h2 className="text-xl font-semibold">Step 1. 업로드 스토리지</h2>
          <p className="text-sm text-white/50">
            이미지/영상 업로드 위치를 선택합니다. 운영 환경에서는 객체 스토리지를 권장합니다.
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
              <label className="text-sm text-white/60">Notes (운영 메모)</label>
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
          <h2 className="text-xl font-semibold">Step 2. 메인 페이지 히어로</h2>
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
                {renderMediaPreview(content.home.hero.heroMedia ?? undefined)}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Step 3. 브랜드 페이지</h2>
          <div className="space-y-8">
            {brandEntries.map(([slug, brand]) => (
              <details key={slug} className="card-slush p-6 space-y-6" open>
                <summary className="flex items-center justify-between cursor-pointer">
                  <div>
                    <h3 className="text-lg font-semibold">{brand.name}</h3>
                    <p className="text-xs text-white/40">Slug: {slug}</p>
                  </div>
                  <span className="text-xs text-white/40">열기/닫기</span>
                </summary>

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
                      <label className="text-sm text-white/60">Metrics</label>
                      <div className="mt-2 space-y-3">
                        {brand.metrics.map((metric, index) => (
                          <div key={`${slug}-metric-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                            <input
                              className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white"
                              placeholder="지표 이름"
                              value={metric.label}
                              onChange={(event) => updateBrandMetric(slug, index, "label", event.target.value)}
                            />
                            <input
                              className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white"
                              placeholder="값"
                              value={metric.value}
                              onChange={(event) => updateBrandMetric(slug, index, "value", event.target.value)}
                            />
                            <button
                              type="button"
                              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/70 hover:text-white"
                              onClick={() => removeBrandMetric(slug, index)}
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/70 hover:text-white"
                          onClick={() => addBrandMetric(slug)}
                        >
                          + 지표 추가
                        </button>
                      </div>
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
                      {renderMediaPreview(brand.heroMedia)}
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Hero SKUs</label>
                      <div className="mt-2 space-y-3">
                        {brand.skus.map((sku, index) => (
                          <div key={`${slug}-sku-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                            <input
                              className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white"
                              placeholder="SKU 이름"
                              value={sku.name}
                              onChange={(event) => updateBrandSku(slug, index, "name", event.target.value)}
                            />
                            <input
                              className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white"
                              placeholder="설명"
                              value={sku.description}
                              onChange={(event) => updateBrandSku(slug, index, "description", event.target.value)}
                            />
                            <button
                              type="button"
                              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/70 hover:text-white"
                              onClick={() => removeBrandSku(slug, index)}
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/70 hover:text-white"
                          onClick={() => addBrandSku(slug)}
                        >
                          + SKU 추가
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-white/60">Channels</label>
                      <div className="mt-2 space-y-3">
                        {brand.channels.map((channel, index) => (
                          <div key={`${slug}-channel-${index}`} className="grid gap-2 md:grid-cols-[1fr_auto]">
                            <input
                              className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white"
                              placeholder="채널 이름"
                              value={channel}
                              onChange={(event) => updateBrandChannel(slug, index, event.target.value)}
                            />
                            <button
                              type="button"
                              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/70 hover:text-white"
                              onClick={() => removeBrandChannel(slug, index)}
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/70 hover:text-white"
                          onClick={() => addBrandChannel(slug)}
                        >
                          + 채널 추가
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button className="btn-slush btn-slush-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {hasChanges ? <p className="text-sm text-white/50">저장 버튼을 눌러 변경사항을 반영하세요.</p> : null}
        </div>
      </div>
    </div>
  )
}
