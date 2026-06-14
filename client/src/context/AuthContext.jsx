/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "../services/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem("careerforge_token"))
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("careerforge_user")
    return storedUser ? JSON.parse(storedUser) : null
  })

  useEffect(() => {
    const handleForcedLogout = () => {
      setToken(null)
      setUser(null)
      navigate("/login", { replace: true })
    }

    window.addEventListener("careerforge:logout", handleForcedLogout)
    return () => window.removeEventListener("careerforge:logout", handleForcedLogout)
  }, [navigate])

  const login = useCallback(async (credentials) => {
    const { data } = await api.post("/auth/login", credentials)
    localStorage.setItem("careerforge_token", data.token)
    localStorage.setItem("careerforge_user", JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const signup = useCallback(async (payload) => {
    const { data } = await api.post("/auth/signup", payload)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("careerforge_token")
    localStorage.removeItem("careerforge_user")
    setToken(null)
    setUser(null)
    navigate("/login", { replace: true })
  }, [navigate])

  const value = useMemo(
    () => ({ isAuthenticated: Boolean(token), login, logout, signup, token, user }),
    [login, logout, signup, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
