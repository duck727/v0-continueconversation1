import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MASTER_COOKIE = "master_auth"
const MASTER_PASSWORD = "master"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/master")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/master/login")) {
    return NextResponse.next()
  }

  const token = process.env.MASTER_ACCESS_TOKEN || MASTER_PASSWORD
  const cookie = request.cookies.get(MASTER_COOKIE)?.value

  if (cookie !== token) {
    const url = request.nextUrl.clone()
    url.pathname = "/master/login"
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/master/:path*"],
}
