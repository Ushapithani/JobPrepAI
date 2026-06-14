import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { getApiError } from "../services/api"

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] =
  useState(false)

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await login(formData)
      showToast({ message: "Welcome back. Your workspace is ready.", type: "success" })
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true })
    } catch (error) {
      showToast({ message: getApiError(error, "Login failed"), type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 lg:grid-cols-[1fr_480px]">
      <section className="hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-3xl font-black bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
  🚀 CareerForge AI
</p>
          <h1 className="mt-20 max-w-2xl text-5xl font-black leading-tight">
            Turn career chaos into a focused execution system.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Manage applications, analyze resumes, prepare interviews, and use AI where it
            actually saves time.
          </p>
          <div className="mt-10 space-y-4">

  <div className="flex items-center gap-3">
    <span>✅</span>
    <span>Resume Analyzer</span>
  </div>

  <div className="flex items-center gap-3">
    <span>✅</span>
    <span>AI Assistant</span>
  </div>

  <div className="flex items-center gap-3">
    <span>✅</span>
    <span>Job Tracker</span>
  </div>

  <div className="flex items-center gap-3">
    <span>✅</span>
    <span>Interview Preparation</span>
  </div>

  <div className="flex items-center gap-3">
    <span>✅</span>
    <span>Career Roadmap</span>
  </div>

</div>
        </div>
        <p className="text-sm text-slate-400">Production-style MERN SaaS workspace</p>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <form
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-black text-white">Log in</h2>
          <p className="mt-2 text-sm text-slate-300">Continue to your CareerForge workspace.</p>
          <p className="mt-2 text-xs text-slate-400">
  AI-powered career growth platform
</p>
<div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3">

  <p className="text-sm text-green-300">
    🔒 Secure authentication powered by CareerForge AI
  </p>

</div>
          <label className="mt-4 block text-sm font-semibold text-slate-200">
            Email
            <input
              required
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
<label className="mt-4 block text-sm font-semibold text-slate-200">
  Password

  <div className="relative">

    <input
      required
      autoComplete="current-password"
      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-20 text-white outline-none focus:border-blue-500"
      minLength={6}
      name="password"
      type={
        showPassword
          ? "text"
          : "password"
      }
      value={formData.password}
      onChange={handleChange}
    />

    <button
      type="button"
      onClick={() =>
        setShowPassword(
          !showPassword
        )
      }
      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-400"
    >
      {showPassword
        ? "Hide"
        : "Show"}
    </button>

  </div>

</label>

  <div className="mt-4 flex items-center justify-between">

  <label className="flex items-center gap-2 text-sm text-slate-300">
    <input
      type="checkbox"
      className="rounded"
    />
    Remember Me
  </label>

 <button
  type="button"
  onClick={() => {
    console.log("Clicked")
    navigate("/forgot-password")
  }}
  className="text-sm text-blue-400 hover:text-blue-300"
>
  Forgot Password?
</button>

</div>



          <button
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 font-bold text-white transition hover:scale-105 disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-300">
            No account yet?{" "}
            <Link className="font-semibold text-blue-400 hover:text-blue-300" to="/signup">
              Create one
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Login
