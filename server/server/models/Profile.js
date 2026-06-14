const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: String,
    email: String,
    phone: String,
    location: String,

    linkedin: String,
    github: String,
    portfolio: String,

    skills: String,
    careerGoal: String,

    profileImage: String,
  },
  { timestamps: true }
)

module.exports =
  mongoose.model(
    "Profile",
    profileSchema
  )