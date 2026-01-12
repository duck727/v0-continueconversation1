import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSiteContent, saveSiteContent } from "@/lib/content"

const MASTER_COOKIE = "master_auth"
const MASTER_PASSWORD = "master"

const isAuthorized = async () => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(MASTER_COOKIE)?.value
  console.log("[v0] API auth check - cookie value:", cookie, "expected:", MASTER_PASSWORD)
  return cookie === MASTER_PASSWORD
}

export async function GET() {
  const authorized = await isAuthorized()
  console.log("[v0] GET /api/admin/content - authorized:", authorized)

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const content = await getSiteContent()
  return NextResponse.json(content)
}

export async function PUT(request: Request) {
  const authorized = await isAuthorized()
  console.log("[v0] PUT /api/admin/content - authorized:", authorized)

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = (await request.json()) as Awaited<ReturnType<typeof getSiteContent>>
  await saveSiteContent(payload)
  return NextResponse.json({ ok: true })
}
