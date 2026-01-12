import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSiteContent, saveSiteContent } from "@/lib/content"

const MASTER_COOKIE = "master_auth"

const isAuthorized = () => {
  const token = process.env.MASTER_ACCESS_TOKEN
  const cookie = cookies().get(MASTER_COOKIE)?.value
  return Boolean(token && cookie === token)
}

export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const content = await getSiteContent()
  return NextResponse.json(content)
}

export async function PUT(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = (await request.json()) as Awaited<ReturnType<typeof getSiteContent>>
  await saveSiteContent(payload)
  return NextResponse.json({ ok: true })
}
