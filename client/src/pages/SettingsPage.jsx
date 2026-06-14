import { useState, useEffect } from "react"
import api from "../services/api"
function SettingsPage() {

const [defaultAI, setDefaultAI] =
useState("Career Coach")

const [responseLength, setResponseLength] =
useState("Detailed")

const [darkMode, setDarkMode] =
useState(false)

const [emailNotifications, setEmailNotifications] =
useState(true)

const [jobAlerts, setJobAlerts] =
useState(true)

const [careerTips, setCareerTips] =
useState(true)

const [interviewReminders, setInterviewReminders] =
useState(true)
const [currentPassword, setCurrentPassword] =
useState("")

const [newPassword, setNewPassword] =
useState("")

const [confirmPassword, setConfirmPassword] =
useState("")
const [showPasswordForm, setShowPasswordForm] =
useState(false)
useEffect(() => {


localStorage.setItem(

  "careerforge_settings",

  JSON.stringify({

    defaultAI,
    responseLength,
    darkMode,
    emailNotifications,
    jobAlerts,
    careerTips,
    interviewReminders,

  })

)


}, [


defaultAI,
responseLength,
darkMode,
emailNotifications,
jobAlerts,
careerTips,
interviewReminders,


])
useEffect(() => {

  const saved =
    JSON.parse(
      localStorage.getItem(
        "careerforge_settings"
      )
    )

  if (!saved) return

  setDefaultAI(
    saved.defaultAI ||
    "Career Coach"
  )

  setResponseLength(
    saved.responseLength ||
    "Detailed"
  )

  setDarkMode(
    saved.darkMode || false
  )

  setEmailNotifications(
    saved.emailNotifications ?? true
  )

  setJobAlerts(
    saved.jobAlerts ?? true
  )

  setCareerTips(
    saved.careerTips ?? true
  )

  setInterviewReminders(
    saved.interviewReminders ?? true
  )

}, [])
useEffect(() => {

  console.log(
    "Dark Mode:",
    darkMode
  )

  if (darkMode) {

    document.documentElement.classList.add(
      "dark"
    )

  } else {

    document.documentElement.classList.remove(
      "dark"
    )

  }

}, [darkMode])

return (


<div className="min-h-screen space-y-6 bg-white dark:bg-black text-slate-900 dark:text-white p-6">

  <div>

    <h1 className="text-4xl font-black text-slate-950 dark:text-white">
      ⚙️ Settings
    </h1>

   <p className="mt-2 text-slate-500 dark:text-slate-400">
      Manage your CareerForge preferences.
    </p>

  </div>

  <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow border dark:border-slate-700">
    <h2 className="mb-6 text-2xl font-bold">
      🤖 AI Preferences
    </h2>

    <div className="space-y-4">

      <div>

        <label className="mb-2 block font-medium">
          Default Assistant
        </label>

        <select
          value={defaultAI}
          onChange={(e) =>
            setDefaultAI(
              e.target.value
            )
          }
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
        >
          <option>Career Coach</option>
          <option>Resume Expert</option>
          <option>Interview Coach</option>
          <option>Coding Assistant</option>
        </select>

      </div>

      <div>

        <label className="mb-2 block font-medium">
          Response Length
        </label>

        <select
          value={responseLength}
          onChange={(e) =>
            setResponseLength(
              e.target.value
            )
          }
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
        >
          <option>Short</option>
          <option>Medium</option>
          <option>Detailed</option>
        </select>

      </div>

    </div>

  </div>

  <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow border dark:border-slate-700">

    <h2 className="mb-6 text-2xl font-bold">
      🎨 Appearance
    </h2>

    <div className="flex items-center justify-between">

      <div>

        <h3 className="font-semibold">
          Dark Mode
        </h3>

        <p className="text-sm text-slate-500">
          Enable dark theme
        </p>

      </div>

      <input
        type="checkbox"
        checked={darkMode}
        onChange={() => {

  console.log(
    "Dark Mode:",
    !darkMode
  )

  setDarkMode(
    !darkMode
  )

}}
        className="h-5 w-5"
      />

    </div>

  </div>

  <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow border dark:border-slate-700">

    <h2 className="mb-6 text-2xl font-bold">
      🔔 Notifications
    </h2>

    <div className="space-y-5">

      <label className="flex items-center justify-between">
        <span>Email Notifications</span>
        <input
          type="checkbox"
          checked={emailNotifications}
          onChange={() =>
            setEmailNotifications(
              !emailNotifications
            )
          }
        />
      </label>

      <label className="flex items-center justify-between">
        <span>Job Alerts</span>
        <input
          type="checkbox"
          checked={jobAlerts}
          onChange={() =>
            setJobAlerts(
              !jobAlerts
            )
          }
        />
      </label>

      <label className="flex items-center justify-between">
        <span>Weekly Career Tips</span>
        <input
          type="checkbox"
          checked={careerTips}
          onChange={() =>
            setCareerTips(
              !careerTips
            )
          }
        />
      </label>

      <label className="flex items-center justify-between">
        <span>Interview Reminders</span>
        <input
          type="checkbox"
          checked={interviewReminders}
          onChange={() =>
            setInterviewReminders(
              !interviewReminders
            )
          }
        />
      </label>

    </div>

  </div>

  <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow border dark:border-slate-700">

    <h2 className="mb-6 text-2xl font-bold">
      🔒 Account & Security
    </h2>

    <div className="space-y-4">

     
     <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">

  <button
    onClick={() =>
      setShowPasswordForm(!showPasswordForm)
    }
    className="flex w-full items-center justify-between"
  >
   <h3 className="text-lg font-medium">
  🔒 Change Password
</h3>

    <span>
      {showPasswordForm ? "▲" : "▼"}
    </span>
  </button>

  {showPasswordForm && (

    <div className="mt-4 space-y-3">

      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) =>
          setCurrentPassword(e.target.value)
        }
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3"
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) =>
          setNewPassword(e.target.value)
        }
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3"
      />

      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(e.target.value)
        }
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3"
      />

      <button
       onClick={async () => {

  if (
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {
    alert("Please fill all fields")
    return
  }

  if (
    newPassword !== confirmPassword
  ) {
    alert("Passwords do not match")
    return
  }

  try {

    const token =
      localStorage.getItem(
        "careerforge_token"
      )

    const { data } =
      await api.post(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

    alert(data.message)

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Password update failed"
    )

  }

}}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 font-bold text-white"
      >
        Update Password
      </button>

    </div>

  )}

</div>

      <button
  onClick={() => {

    const data = {

      user:
        JSON.parse(
          localStorage.getItem(
            "careerforge_user"
          )
        ),

      settings:
        JSON.parse(
          localStorage.getItem(
            "careerforge_settings"
          )
        ),

    }

    const blob =
      new Blob(

        [
          JSON.stringify(
            data,
            null,
            2
          ),
        ],

        {
          type:
            "application/json",
        }

      )

    const url =
      URL.createObjectURL(
        blob
      )

    const a =
      document.createElement(
        "a"
      )

    a.href = url

    a.download =
      "careerforge-data.json"

    a.click()

  }}
  className="w-full rounded-xl border border-slate-200 px-5 py-3 text-left font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
>
  📥 Export My Data
</button>

      <button
  onClick={() => {

    localStorage.removeItem(
      "careerforge_chats"
    )

    alert(
      "Chat history cleared"
    )

  }}
  className="w-full rounded-xl border border-slate-200 px-5 py-3 text-left font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
>
  🧹 Clear Chat History
</button>

     <button
  onClick={() => {

    localStorage.removeItem(
      "careerforge_token"
    )

    localStorage.removeItem(
      "careerforge_user"
    )

    window.location.href = "/login"

  }}
  className="w-full rounded-xl border border-slate-200 px-5 py-3 text-left font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
>
  🚪 Logout
</button>
      <button
  onClick={() => {

    const confirmDelete =
      window.confirm(
        "Delete your account?"
      )

    if (
      confirmDelete
    ) {

      localStorage.clear()

      window.location.href =
        "/login"

    }

  }}
  className="w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-left font-medium text-red-600 transition hover:bg-red-100"
>
  🗑 Delete Account
</button>

    </div>

  </div>

</div>


)

}

export default SettingsPage
