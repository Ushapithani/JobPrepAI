import { useState } from "react"
import { Link } from "react-router-dom"
import { useToast } from "../context/ToastContext"
function ForgotPassword() {
  const [email, setEmail] = useState("")
const { showToast } = useToast()
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8">

        <h1 className="text-3xl font-black text-white">
          Forgot Password
        </h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
          placeholder="Enter Email"
        />
<button
  type="button"
  onClick={() =>
    showToast({
      message:
        "Password reset link sent successfully.",
      type: "success",
    })
  }
  className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 font-bold text-white"
>
  Send Reset Link
</button>
<Link
  to="/login"
  className="text-blue-400"
>
  Login
</Link>
      </div>

    </main>
  )
}

export default ForgotPassword