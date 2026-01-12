import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSiteContent, saveSiteContent } from "@/lib/content"

const MASTER_COOKIE = "master_auth"

const isAuthorized = async () => {
  const token = process.env.MASTER_ACCESS_TOKEN ?? "master"
  const cookieStore = await cookies()
  const cookie = cookieStore.get(MASTER_COOKIE)?.value
  return Boolean(token && cookie === token)
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const content = await getSiteContent()
    return NextResponse.json(content)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load content"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const payload = (await request.json()) as Awaited<ReturnType<typeof getSiteContent>>
    await saveSiteContent(payload)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save content"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
