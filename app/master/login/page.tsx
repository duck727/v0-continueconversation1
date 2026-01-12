import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const MASTER_COOKIE = "master_auth"
const MASTER_PASSWORD = "master"

async function loginAction(formData: FormData) {
  "use server"
  const password = String(formData.get("password") ?? "")

  console.log("[v0] Login attempt with password:", password)
  console.log("[v0] Expected password:", MASTER_PASSWORD)

  if (password !== MASTER_PASSWORD) {
    console.log("[v0] Password mismatch, redirecting with error")
    redirect("/master/login?error=1")
  }

  console.log("[v0] Password correct, setting cookie")
  const cookieStore = await cookies()
  cookieStore.set(MASTER_COOKIE, MASTER_PASSWORD, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  console.log("[v0] Cookie set, redirecting to /master")
  redirect("/master")
}

export default async function MasterLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = params.error === "1"

  const cookieStore = await cookies()
  const existingAuth = cookieStore.get(MASTER_COOKIE)?.value
  if (existingAuth === MASTER_PASSWORD) {
    redirect("/master")
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-semibold mb-2">Master Access</h1>
        <p className="text-sm text-white/50 mb-6">Enter the master password to manage site content.</p>

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="text-sm text-white/60" htmlFor="password">
              Master Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-400"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>

          {hasError && <p className="text-sm text-red-400">Invalid password. Try again.</p>}

          <button
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity"
            type="submit"
          >
            Unlock Master Page
          </button>
        </form>

        <p className="text-xs text-white/40 mt-6 text-center">Authorized personnel only</p>
      </div>
    </div>
  )
}
