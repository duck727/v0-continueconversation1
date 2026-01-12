import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const MASTER_COOKIE = "master_auth"
const MASTER_PASSWORD = "thsdudejr1!"

async function loginAction(formData: FormData) {
  "use server"
  const token = process.env.MASTER_ACCESS_TOKEN || MASTER_PASSWORD
  const password = String(formData.get("password") ?? "")

  if (password !== token) {
    redirect("/master/login?error=1")
  }

  const cookieStore = await cookies()
  cookieStore.set(MASTER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  redirect("/master")
}

export default async function MasterLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = params.error === "1"

  return (
    <div className="min-h-screen slush-bg text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md card-slush p-8">
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
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>

          {hasError && <p className="text-sm text-red-400">Invalid password. Try again.</p>}

          <button className="btn-slush btn-slush-primary w-full" type="submit">
            Unlock Master Page
          </button>
        </form>

        <p className="text-xs text-white/40 mt-6 text-center">Authorized personnel only</p>
      </div>
    </div>
  )
}
