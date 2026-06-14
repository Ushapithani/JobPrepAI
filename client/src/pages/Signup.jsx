import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { getApiError } from "../services/api"

function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
})

const [showPassword, setShowPassword] =
  useState(false)

const [
  showConfirmPassword,
  setShowConfirmPassword,
] = useState(false)

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
      if (
  formData.password !==
  formData.confirmPassword
) {

  showToast({
    message:
      "Passwords do not match",
    type: "error",
  })

  setIsSubmitting(false)

  return
}
      await signup(formData)
      showToast({ message: "Account created. You can log in now.", type: "success" })
      navigate("/login")
    } catch (error) {
      showToast({ message: getApiError(error, "Signup failed"), type: "error" })
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
      Build your career with AI-powered guidance.
    </h1>

    <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
      Create your account and unlock resume analysis,
      interview preparation, career roadmaps, job tracking,
      and intelligent career insights.
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

  <p className="text-sm text-slate-400">
    Production-style MERN SaaS workspace
  </p>

</section>
      <section className="flex items-center justify-center px-4 py-10">

<form
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-black text-white">
  Create Account 🚀
</h1>

<p className="mt-2 text-sm text-slate-300">
  Start building your AI-powered career workspace.
</p>

        <label className="mt-6 block text-sm font-semibold text-slate-200">
          Name
          <input
            required
            autoComplete="name"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-slate-200">
          Email
          <input
            required
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-slate-200">
          Password
          <input
            required
            autoComplete="new-password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            minLength={6}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
<label className="mt-4 block text-sm font-semibold text-slate-200">

  Confirm Password

  <input
    required
    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-500"
    name="confirmPassword"
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }
    value={formData.confirmPassword}
    onChange={handleChange}
  />

</label>
        <button
          className="mt-6 w-full rounded-lg mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 font-bold text-white transition hover:scale-105 disabled:opacity-60 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating..." : "Create account"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link className="font-semibold text-blue-400 hover:text-blue-300 hover:text-sky-800" to="/login">
            Login
          </Link>
        </p>
      </form>
      </section>
    </main>
  )
}

export default Signup
