import { HomePage } from "@/components/home-page"
import { getSiteContent } from "@/lib/content"

export default async function Home() {
  const content = await getSiteContent()

  return <HomePage content={content} />
}
