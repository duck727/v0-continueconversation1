import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import crypto from "crypto"
import path from "path"
import { promises as fs } from "fs"

const MASTER_COOKIE = "master_auth"

export async function POST(request: NextRequest) {
  const token = process.env.MASTER_ACCESS_TOKEN ?? "master"
  const cookieStore = await cookies()
  const cookie = cookieStore.get(MASTER_COOKIE)?.value

  if (!token || cookie !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const provider = request.nextUrl.searchParams.get("provider") ?? "local"

  if (provider !== "local") {
    return NextResponse.json({ error: "Unsupported provider" }, { status: 400 })
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const extension = path.extname(file.name) || (file.type.startsWith("video/") ? ".mp4" : ".jpg")
  const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`
  const uploadDir = path.join(process.cwd(), "public", "uploads")
  await fs.mkdir(uploadDir, { recursive: true })
  await fs.writeFile(path.join(uploadDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}
