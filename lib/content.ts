import path from "path"
import { promises as fs } from "fs"

export type MediaAsset = {
  type: "image" | "video"
  url: string
  alt?: string
  poster?: string
}

export type BrandMetric = { label: string; value: string }
export type BrandSku = { name: string; description: string }

export type BrandContent = {
  name: string
  tagline: string
  oneLiner: string
  color: string
  heroMedia?: MediaAsset
  metrics: BrandMetric[]
  skus: BrandSku[]
  channels: string[]
}

export type SiteContent = {
  storage: {
    provider: "local" | "manual"
    note?: string
  }
  home: {
    hero: {
      badge: string
      title: string
      titleHighlight: string
      subtitle: string
      ctaPrimary: string
      ctaSecondary: string
      heroMedia?: MediaAsset
    }
  }
  brands: Record<string, BrandContent>
}

const CONTENT_PATH = path.join(process.cwd(), "data", "site-content.json")

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8")
  return JSON.parse(raw) as SiteContent
}

export async function saveSiteContent(content: SiteContent) {
  await fs.writeFile(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`, "utf-8")
}
