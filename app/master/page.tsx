"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { BrandContent, SiteContent, BrandMetric, BrandSku } from "@/lib/content"
import {
  Upload,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  Video,
  X,
  Check,
  ExternalLink,
} from "lucide-react"

export default function MasterPage() {
  const router = useRouter()
  const [content, setContent] = useState<SiteContent | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<"home" | string>("home")
  const [showPreview, setShowPreview] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["hero", "brands"]))
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [addingBrand, setAddingBrand] = useState(false)
  const [newBrandSlug, setNewBrandSlug] = useState("")

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

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) next.delete(section)
      else next.add(section)
      return next
    })
  }

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    })
    setSaving(false)
    showMessage(response.ok ? "Changes saved!" : "Failed to save.", response.ok ? "success" : "error")
  }

  const uploadFile = async (file: File, targetId: string): Promise<string> => {
    setUploading(targetId)
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`/api/uploads?provider=${content?.storage.provider ?? "blob"}`, {
      method: "POST",
      body: formData,
    })

    setUploading(null)

    if (!response.ok) {
      showMessage("Upload failed", "error")
      return ""
    }

    const data = (await response.json()) as { url?: string }
    showMessage("File uploaded!", "success")
    return data.url ?? ""
  }

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetId: string, updateFn: (url: string) => void) => {
      e.preventDefault()
      setDragOver(null)
      const file = e.dataTransfer.files[0]
      if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
        const url = await uploadFile(file, targetId)
        if (url) updateFn(url)
      }
    },
    [content?.storage.provider],
  )

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetId: string,
    updateFn: (url: string) => void,
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = await uploadFile(file, targetId)
      if (url) updateFn(url)
    }
  }

  // Content update functions
  const updateHome = (field: keyof SiteContent["home"]["hero"], value: string) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            home: { ...prev.home, hero: { ...prev.home.hero, [field]: value } },
          }
        : prev,
    )
  }

  const updateHomeMedia = (field: string, value: string) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            home: {
              ...prev.home,
              hero: {
                ...prev.home.hero,
                heroMedia: { type: "image", url: "", ...prev.home.hero.heroMedia, [field]: value },
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
            brands: { ...prev.brands, [slug]: { ...prev.brands[slug], [field]: value } },
          }
        : prev,
    )
  }

  const updateBrandMedia = (slug: string, field: string, value: string) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            brands: {
              ...prev.brands,
              [slug]: {
                ...prev.brands[slug],
                heroMedia: { type: "image", url: "", ...prev.brands[slug].heroMedia, [field]: value },
              },
            },
          }
        : prev,
    )
  }

  const addMetric = (slug: string) => {
    const brand = content?.brands[slug]
    if (!brand) return
    updateBrand(slug, "metrics", [...brand.metrics, { label: "New Metric", value: "0" }])
  }

  const updateMetric = (slug: string, index: number, field: keyof BrandMetric, value: string) => {
    const brand = content?.brands[slug]
    if (!brand) return
    const metrics = [...brand.metrics]
    metrics[index] = { ...metrics[index], [field]: value }
    updateBrand(slug, "metrics", metrics)
  }

  const removeMetric = (slug: string, index: number) => {
    const brand = content?.brands[slug]
    if (!brand) return
    updateBrand(
      slug,
      "metrics",
      brand.metrics.filter((_, i) => i !== index),
    )
  }

  const addSku = (slug: string) => {
    const brand = content?.brands[slug]
    if (!brand) return
    updateBrand(slug, "skus", [...brand.skus, { name: "New Product", description: "Description" }])
  }

  const updateSku = (slug: string, index: number, field: keyof BrandSku, value: string) => {
    const brand = content?.brands[slug]
    if (!brand) return
    const skus = [...brand.skus]
    skus[index] = { ...skus[index], [field]: value }
    updateBrand(slug, "skus", skus)
  }

  const removeSku = (slug: string, index: number) => {
    const brand = content?.brands[slug]
    if (!brand) return
    updateBrand(
      slug,
      "skus",
      brand.skus.filter((_, i) => i !== index),
    )
  }

  const addChannel = (slug: string) => {
    const brand = content?.brands[slug]
    if (!brand) return
    updateBrand(slug, "channels", [...brand.channels, "New Channel"])
  }

  const updateChannel = (slug: string, index: number, value: string) => {
    const brand = content?.brands[slug]
    if (!brand) return
    const channels = [...brand.channels]
    channels[index] = value
    updateBrand(slug, "channels", channels)
  }

  const removeChannel = (slug: string, index: number) => {
    const brand = content?.brands[slug]
    if (!brand) return
    updateBrand(
      slug,
      "channels",
      brand.channels.filter((_, i) => i !== index),
    )
  }

  const addNewBrand = () => {
    if (!newBrandSlug.trim() || !content) return
    const slug = newBrandSlug
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    if (content.brands[slug]) {
      showMessage("Brand already exists", "error")
      return
    }
    setContent({
      ...content,
      brands: {
        ...content.brands,
        [slug]: {
          name: newBrandSlug,
          tagline: "Your tagline here",
          oneLiner: "One-liner description",
          color: "#4AE3C3",
          metrics: [],
          skus: [],
          channels: [],
        },
      },
    })
    setNewBrandSlug("")
    setAddingBrand(false)
    setActiveSection(slug)
    showMessage("Brand added!", "success")
  }

  const deleteBrand = (slug: string) => {
    if (!content || !confirm(`Delete ${content.brands[slug].name}?`)) return
    const { [slug]: _, ...rest } = content.brands
    setContent({ ...content, brands: rest })
    setActiveSection("home")
    showMessage("Brand deleted", "success")
  }

  const handleLogout = () => {
    document.cookie = "master_auth=; path=/; max-age=0"
    router.push("/master/login")
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading editor...</p>
        </div>
      </div>
    )
  }

  const brandEntries = Object.entries(content.brands)

  // Inline editable text component
  const EditableText = ({
    value,
    onChange,
    className = "",
    multiline = false,
    placeholder = "",
  }: {
    value: string
    onChange: (v: string) => void
    className?: string
    multiline?: boolean
    placeholder?: string
  }) => {
    const [editing, setEditing] = useState(false)
    const [tempValue, setTempValue] = useState(value)

    if (editing) {
      return multiline ? (
        <textarea
          autoFocus
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => {
            onChange(tempValue)
            setEditing(false)
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setTempValue(value)
              setEditing(false)
            }
          }}
          className={`w-full bg-white/5 border border-teal-500/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400 resize-none ${className}`}
          rows={3}
        />
      ) : (
        <input
          autoFocus
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => {
            onChange(tempValue)
            setEditing(false)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onChange(tempValue)
              setEditing(false)
            }
            if (e.key === "Escape") {
              setTempValue(value)
              setEditing(false)
            }
          }}
          className={`w-full bg-white/5 border border-teal-500/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400 ${className}`}
          placeholder={placeholder}
        />
      )
    }

    return (
      <div
        onClick={() => {
          setTempValue(value)
          setEditing(true)
        }}
        className={`cursor-text hover:bg-white/5 rounded-lg px-3 py-2 transition-colors border border-transparent hover:border-white/10 ${className} ${!value ? "text-white/30 italic" : ""}`}
      >
        {value || placeholder || "Click to edit..."}
      </div>
    )
  }

  // Media upload zone component
  const MediaZone = ({
    media,
    onUpdate,
    targetId,
    label,
  }: {
    media?: { type: string; url: string; alt?: string }
    onUpdate: (field: string, value: string) => void
    targetId: string
    label: string
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">{label}</span>
        <select
          value={media?.type ?? "image"}
          onChange={(e) => onUpdate("type", e.target.value)}
          className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(targetId)
        }}
        onDragLeave={() => setDragOver(null)}
        onDrop={(e) => handleDrop(e, targetId, (url) => onUpdate("url", url))}
        className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all ${
          dragOver === targetId ? "border-teal-400 bg-teal-400/10" : "border-white/20 hover:border-white/40"
        }`}
      >
        {media?.url ? (
          <div className="relative group">
            {media.type === "video" ? (
              <video src={media.url} className="w-full h-48 object-cover" />
            ) : (
              <img src={media.url || "/placeholder.svg"} alt={media.alt || ""} className="w-full h-48 object-cover" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <label className="cursor-pointer p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Upload className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, targetId, (url) => onUpdate("url", url))}
                />
              </label>
              <button
                onClick={() => onUpdate("url", "")}
                className="p-3 bg-red-500/20 rounded-full hover:bg-red-500/40 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            </div>
            {uploading === targetId && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-white/5 transition-colors">
            {uploading === targetId ? (
              <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {media?.type === "video" ? (
                  <Video className="w-10 h-10 text-white/30 mb-2" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-white/30 mb-2" />
                )}
                <span className="text-sm text-white/40">Drop file or click to upload</span>
              </>
            )}
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, targetId, (url) => onUpdate("url", url))}
            />
          </label>
        )}
      </div>
      <input
        value={media?.url ?? ""}
        onChange={(e) => onUpdate("url", e.target.value)}
        placeholder="Or paste URL..."
        className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/60 focus:outline-none focus:border-teal-400"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Left Sidebar - Navigation */}
      <aside className="w-64 bg-black/40 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            EOEO Studio
          </h1>
          <p className="text-xs text-white/40 mt-1">Visual Content Editor</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Home Section */}
          <button
            onClick={() => setActiveSection("home")}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
              activeSection === "home" ? "bg-teal-500/20 text-teal-400" : "hover:bg-white/5 text-white/70"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-teal-400" />
            Homepage
          </button>

          {/* Brands */}
          <div className="pt-4">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs text-white/40 uppercase tracking-wider">Brands</span>
              <button onClick={() => setAddingBrand(true)} className="p-1 hover:bg-white/10 rounded transition-colors">
                <Plus className="w-4 h-4 text-white/40" />
              </button>
            </div>

            {addingBrand && (
              <div className="mx-3 mb-2 flex gap-2">
                <input
                  autoFocus
                  value={newBrandSlug}
                  onChange={(e) => setNewBrandSlug(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addNewBrand()
                    if (e.key === "Escape") setAddingBrand(false)
                  }}
                  placeholder="Brand name..."
                  className="flex-1 text-sm bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
                />
                <button onClick={addNewBrand} className="p-2 bg-teal-500/20 rounded-lg hover:bg-teal-500/30">
                  <Check className="w-4 h-4 text-teal-400" />
                </button>
              </div>
            )}

            {brandEntries.map(([slug, brand]) => (
              <button
                key={slug}
                onClick={() => setActiveSection(slug)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 group ${
                  activeSection === slug ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/70"
                }`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brand.color }} />
                <span className="flex-1 truncate">{brand.name}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={handleLogout} className="w-full text-center text-xs text-white/40 hover:text-white/60 py-2">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex">
        {/* Editor Panel */}
        <div className={`${showPreview ? "w-1/2" : "w-full"} p-6 overflow-y-auto`}>
          {message && (
            <div
              className={`mb-4 px-4 py-3 rounded-xl text-sm ${
                message.type === "success" ? "bg-teal-500/20 text-teal-400" : "bg-red-500/20 text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Homepage Editor */}
          {activeSection === "home" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Homepage</h2>
                <a
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-teal-400 hover:underline"
                  rel="noreferrer"
                >
                  View Live <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Hero Section */}
              <section className="bg-white/5 rounded-2xl p-6 space-y-6">
                <button
                  onClick={() => toggleSection("hero")}
                  className="w-full flex items-center justify-between text-lg font-semibold"
                >
                  <span>Hero Section</span>
                  {expandedSections.has("hero") ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>

                {expandedSections.has("hero") && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider">Badge</label>
                      <EditableText value={content.home.hero.badge} onChange={(v) => updateHome("badge", v)} />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider">Title</label>
                      <EditableText
                        value={content.home.hero.title}
                        onChange={(v) => updateHome("title", v)}
                        className="text-2xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider">
                        Title Highlight (Gradient)
                      </label>
                      <EditableText
                        value={content.home.hero.titleHighlight}
                        onChange={(v) => updateHome("titleHighlight", v)}
                        className="text-2xl font-bold text-teal-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-wider">Subtitle</label>
                      <EditableText
                        value={content.home.hero.subtitle}
                        onChange={(v) => updateHome("subtitle", v)}
                        multiline
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-wider">Primary CTA</label>
                        <EditableText
                          value={content.home.hero.ctaPrimary}
                          onChange={(v) => updateHome("ctaPrimary", v)}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-wider">Secondary CTA</label>
                        <EditableText
                          value={content.home.hero.ctaSecondary}
                          onChange={(v) => updateHome("ctaSecondary", v)}
                        />
                      </div>
                    </div>
                    <MediaZone
                      media={content.home.hero.heroMedia}
                      onUpdate={(f, v) => updateHomeMedia(f, v)}
                      targetId="home-hero"
                      label="Hero Media"
                    />
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Brand Editor */}
          {activeSection !== "home" && content.brands[activeSection] && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: content.brands[activeSection].color }}
                  />
                  <h2 className="text-2xl font-bold">{content.brands[activeSection].name}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`/brands/${activeSection}`}
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-teal-400 hover:underline"
                    rel="noreferrer"
                  >
                    View Live <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => deleteBrand(activeSection)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <section className="bg-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold">Basic Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider">Brand Name</label>
                    <EditableText
                      value={content.brands[activeSection].name}
                      onChange={(v) => updateBrand(activeSection, "name", v)}
                      className="font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-wider">Brand Color</label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="color"
                        value={content.brands[activeSection].color}
                        onChange={(e) => updateBrand(activeSection, "color", e.target.value)}
                        className="w-12 h-10 rounded-lg cursor-pointer bg-transparent"
                      />
                      <input
                        value={content.brands[activeSection].color}
                        onChange={(e) => updateBrand(activeSection, "color", e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider">Tagline</label>
                  <EditableText
                    value={content.brands[activeSection].tagline}
                    onChange={(v) => updateBrand(activeSection, "tagline", v)}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider">One-liner</label>
                  <EditableText
                    value={content.brands[activeSection].oneLiner}
                    onChange={(v) => updateBrand(activeSection, "oneLiner", v)}
                    multiline
                  />
                </div>
                <MediaZone
                  media={content.brands[activeSection].heroMedia}
                  onUpdate={(f, v) => updateBrandMedia(activeSection, f, v)}
                  targetId={`brand-${activeSection}-hero`}
                  label="Hero Media"
                />
              </section>

              {/* Metrics */}
              <section className="bg-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Metrics</h3>
                  <button
                    onClick={() => addMetric(activeSection)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {content.brands[activeSection].metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-2 group">
                      <GripVertical className="w-4 h-4 text-white/20 cursor-grab" />
                      <input
                        value={metric.label}
                        onChange={(e) => updateMetric(activeSection, i, "label", e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                        placeholder="Label"
                      />
                      <input
                        value={metric.value}
                        onChange={(e) => updateMetric(activeSection, i, "value", e.target.value)}
                        className="w-32 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                        placeholder="Value"
                      />
                      <button
                        onClick={() => removeMetric(activeSection, i)}
                        className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* SKUs */}
              <section className="bg-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Products (SKUs)</h3>
                  <button
                    onClick={() => addSku(activeSection)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {content.brands[activeSection].skus.map((sku, i) => (
                    <div key={i} className="flex items-start gap-2 group bg-white/5 rounded-xl p-3">
                      <GripVertical className="w-4 h-4 text-white/20 cursor-grab mt-2" />
                      <div className="flex-1 space-y-2">
                        <input
                          value={sku.name}
                          onChange={(e) => updateSku(activeSection, i, "name", e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-sm font-medium focus:outline-none focus:border-teal-400"
                          placeholder="Product name"
                        />
                        <input
                          value={sku.description}
                          onChange={(e) => updateSku(activeSection, i, "description", e.target.value)}
                          className="w-full bg-transparent text-white/60 text-xs focus:outline-none"
                          placeholder="Description"
                        />
                      </div>
                      <button
                        onClick={() => removeSku(activeSection, i)}
                        className="p-1 text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Channels */}
              <section className="bg-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Sales Channels</h3>
                  <button
                    onClick={() => addChannel(activeSection)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {content.brands[activeSection].channels.map((channel, i) => (
                    <div key={i} className="flex items-center gap-1 bg-white/10 rounded-full pl-4 pr-2 py-2 group">
                      <input
                        value={channel}
                        onChange={(e) => updateChannel(activeSection, i, e.target.value)}
                        className="bg-transparent text-sm w-24 focus:outline-none"
                      />
                      <button
                        onClick={() => removeChannel(activeSection, i)}
                        className="p-1 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Live Preview Panel */}
        {showPreview && (
          <div className="w-1/2 border-l border-white/10 bg-black/20">
            <div className="sticky top-0 bg-black/60 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-white/60">Live Preview</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/40">Auto-updating</span>
              </div>
            </div>
            <iframe
              src={activeSection === "home" ? "/" : `/brands/${activeSection}`}
              className="w-full h-[calc(100vh-52px)]"
              key={`preview-${activeSection}`}
            />
          </div>
        )}
      </main>
    </div>
  )
}
