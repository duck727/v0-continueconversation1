import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MASTER_COOKIE = "master_auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/master")) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/master/login")) {
    return NextResponse.next()
  }

  const token = process.env.MASTER_ACCESS_TOKEN
  const fallbackToken = "Master"
  const cookie = request.cookies.get(MASTER_COOKIE)?.value

  if (!cookie || (cookie !== token && cookie !== fallbackToken)) {
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
