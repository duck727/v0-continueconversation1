import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSiteContent, saveSiteContent } from "@/lib/content"

const MASTER_COOKIE = "master_auth"
const MASTER_PASSWORD = "master"

const isAuthorized = async () => {
  const token = process.env.MASTER_ACCESS_TOKEN || MASTER_PASSWORD
  const cookieStore = await cookies()
  const cookie = cookieStore.get(MASTER_COOKIE)?.value
  return Boolean(cookie === token)
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const content = await getSiteContent()
  return NextResponse.json(content)
}

export async function PUT(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = (await request.json()) as Awaited<ReturnType<typeof getSiteContent>>
  await saveSiteContent(payload)
  return NextResponse.json({ ok: true })
}
