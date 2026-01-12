import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const MASTER_COOKIE = "master_auth"

async function loginAction(formData: FormData) {
  "use server"
  const token = process.env.MASTER_ACCESS_TOKEN ?? "master"
  const password = String(formData.get("password") ?? "")

  if (!token || password !== token) {
    redirect("/master/login?error=1")
  }

  cookies().set(MASTER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })

  redirect("/master")
}

export default async function MasterLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedParams = await searchParams
  const hasError = resolvedParams.error === "1"

  return (
    <div className="min-h-screen slush-bg text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md card-slush p-8">
        <h1 className="text-3xl font-semibold mb-2">Master Access</h1>
        <p className="text-sm text-white/50 mb-6">
          Enter the master access token to manage brand and homepage content.
        </p>

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="text-sm text-white/60" htmlFor="password">
              Master token
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              placeholder="Enter token"
              required
            />
          </div>

          {hasError ? <p className="text-sm text-red-400">Invalid token. Try again.</p> : null}

          <button className="btn-slush btn-slush-primary w-full" type="submit">
            Unlock Master Page
          </button>
        </form>

        <p className="text-xs text-white/40 mt-6">
          기본 토큰은 <span className="text-white">master</span> 입니다. 환경 변수로{" "}
          <span className="text-white">MASTER_ACCESS_TOKEN</span>을 설정하면 변경할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
