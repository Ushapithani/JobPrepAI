import { useState, useEffect } from "react"
import api from "../services/api"
import {
  Outlet,
  useNavigate,
} from "react-router-dom"

import Sidebar from "../components/common/Sidebar"


function MainLayout() {

  const navigate =
    useNavigate()

  const [
  showProfileMenu,
  setShowProfileMenu,
] = useState(false)



  const handleLogout = () => {

  localStorage.removeItem(
    "careerforge_token"
  )

  localStorage.removeItem(
    "careerforge_user"
  )

  window.location.href =
    "/login"

}

  const [profile, setProfile] = useState({})

useEffect(() => {
  const loadProfile = async () => {
    try {
      const { data } = await api.get("/profile")
      setProfile(data || {})
    } catch (error) {
      console.log(error)
    }
  }

  loadProfile()
}, [])

const profileImage =
  profile?.profileImage

const userName =
  profile?.fullName || "User"

  const displayName =
    userName.split(" ")[0]

  const userInitial =
    userName.charAt(0).toUpperCase()

  return (

    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <div className="lg:ml-[240px]">

        {/* Header */}

        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 shadow-sm">

          <div>

            <h1 className="text-xl font-bold text-slate-900">
              CareerForge AI
            </h1>

            <p className="text-sm text-slate-500">
              AI Career Operating System
            </p>

          </div>
           

          {/* Profile */}

          <div className="ml-auto flex items-center gap-4">

            <button
              onClick={() =>
                setShowProfileMenu(
                  !showProfileMenu
                )
              }
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 transition hover:bg-slate-50"
            >

              {profileImage ? (

  <img
    src={profileImage}
    alt="Profile"
    className="h-10 w-10 rounded-full object-cover border"
  />

) : (

  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 font-bold text-white">

    {userInitial}

  </div>

)}
              <div className="text-left">

                <p className="font-semibold text-slate-900">
                  {displayName}
                </p>

                <p className="text-xs text-slate-500">
                  CareerForge User
                </p>

              </div>

              <span className="text-slate-400">
                ▼
              </span>

            </button>

            {showProfileMenu && (

              <div className="absolute right-0 top-14 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

                <button
                  onClick={() => {

                    navigate(
                      "/profile"
                    )

                    setShowProfileMenu(
                      false
                    )

                  }}
                  className="w-full rounded-xl px-4 py-3 text-left transition hover:bg-slate-100"
                >
                  👤 My Profile
                </button>

                <button
                  onClick={() => {

                    navigate(
                      "/settings"
                    )

                    setShowProfileMenu(
                      false
                    )

                  }}
                  className="w-full rounded-xl px-4 py-3 text-left transition hover:bg-slate-100"
                >
                  ⚙️ Settings
                </button>

                <hr className="my-2" />

                <button
                  onClick={
                    handleLogout
                  }
                  className="w-full rounded-xl px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
                >
                  🚪 Logout
                </button>

              </div>

            )}

          </div>

        </header>

        {/* Content */}

        <main>

          <div className="mx-auto max-w-7xl px-6 py-6">

            <Outlet />

          </div>

        </main>

      </div>

    </div>

  )

}

export default MainLayout