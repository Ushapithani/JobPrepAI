import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"
const defaultProfile = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  skills: "",
  careerGoal: "",
  profileImage: "",
}

function ProfilePage() {

  const { user } = useAuth()

  const [profile, setProfile] =
    useState(defaultProfile)
    const profileFields = [
  profile.fullName,
  profile.email,
  profile.phone,
  profile.location,
  profile.linkedin,
  profile.github,
  profile.portfolio,
  profile.skills,
  profile.careerGoal,
  profile.profileImage,
]

const completedFields =
  profileFields.filter(
    field => field && field.trim() !== ""
  ).length

const completionPercentage =
  Math.round(
    (completedFields /
      profileFields.length) * 100
  )

  useEffect(() => {

  const loadProfile =
    async () => {

      try {

        const { data } =
          await api.get(
            "/profile"
          )

        if (data) {
          setProfile(data)
        }

      } catch (error) {
        console.log(error)
      }

    }

  loadProfile()

}, [])
  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]:
        e.target.value,
    })

  }

  const handleImageUpload = (e) => {

    const file =
      e.target.files[0]

    if (!file) return

    const reader =
      new FileReader()

    reader.onloadend = () => {

      setProfile({
        ...profile,
        profileImage:
          reader.result,
      })

    }

    reader.readAsDataURL(file)

  }

 const saveProfile =
  async () => {

    try {

      await api.put(
        "/profile",
        profile
      )

      alert(
        "Profile saved successfully!"
      )

    } catch (error) {
  console.error(error)

  alert(
    error.response?.data?.message ||
    error.message ||
    "Failed to save profile"
  )
}
  }
  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-4xl font-black text-slate-950">
          👤 My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your personal and career information.
        </p>

      </div>
      <div className="rounded-2xl bg-white p-6 shadow">

  <div className="flex items-center justify-between">

    <div>

      <h2 className="text-xl font-bold">
        📊 Profile Completion
      </h2>

      <p className="text-slate-500">
        Complete your profile to unlock
        better career insights.
      </p>

    </div>

    <span className="text-3xl font-black text-blue-600">
      {completionPercentage}%
    </span>

  </div>

  <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200">

    <div
      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-500"
      style={{
        width: `${completionPercentage}%`,
      }}
    />

  </div>
  <p className="mt-3 text-sm text-slate-500">

  {completionPercentage === 100
    ? "🎉 Profile completed!"
    : `${10 - completedFields} field(s) remaining.`}

</p>

</div>

      <div className="rounded-2xl bg-white p-6 shadow">

        {/* Profile Header */}

        <div className="mb-6 flex items-center gap-4">

          {profile.profileImage ? (

            <img
              src={profile.profileImage}
              alt="Profile"
              className="h-20 w-20 rounded-full border object-cover"
            />

          ) : (

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-3xl font-bold text-white">

              {profile.fullName
                ? profile.fullName
                    .charAt(0)
                    .toUpperCase()
                : "U"}

            </div>

          )}

          <div>

            <h2 className="text-2xl font-bold">
              {profile.fullName ||
                "User"}
            </h2>

            <p className="text-slate-500">
              CareerForge User
            </p>

            <label className="mt-2 inline-block cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">

              {profile.profileImage
                ? "📸 Change Photo"
                : "📷 Upload Photo"}

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImageUpload
                }
                className="hidden"
              />

            </label>

          </div>

        </div>

        {/* Form */}

        <div className="grid gap-4 md:grid-cols-2">

          <input
            name="fullName"
            placeholder="Full Name"
            value={profile.fullName}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={profile.phone}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="location"
            placeholder="Location"
            value={profile.location}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="linkedin"
            placeholder="LinkedIn URL"
            value={profile.linkedin}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="github"
            placeholder="GitHub URL"
            value={profile.github}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="portfolio"
            placeholder="Portfolio URL"
            value={profile.portfolio}
            onChange={handleChange}
            className="rounded-xl border p-3 md:col-span-2"
          />

        </div>

        <textarea
          name="skills"
          placeholder="Skills"
          value={profile.skills}
          onChange={handleChange}
          className="mt-4 h-32 w-full rounded-xl border p-3"
        />

        <textarea
          name="careerGoal"
          placeholder="Career Goal"
          value={profile.careerGoal}
          onChange={handleChange}
          className="mt-4 h-32 w-full rounded-xl border p-3"
        />

        <button
          onClick={saveProfile}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          💾 Save Profile
        </button>

      </div>

    </div>

  )

}

export default ProfilePage