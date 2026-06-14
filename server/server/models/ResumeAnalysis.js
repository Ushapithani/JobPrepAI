const mongoose = require("mongoose")

const resumeAnalysisSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      atsScore: Number,

      summary: String,

      strengths: [String],

      gaps: [String],

      recommendations: [String],

      keywords: [String],
    },
    {
      timestamps: true,
    }
  )

module.exports =
  mongoose.model(
    "ResumeAnalysis",
    resumeAnalysisSchema
  )