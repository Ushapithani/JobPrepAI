const mongoose = require('mongoose')

const allowedStatuses = [
  'Saved',
  'Applied',
  'Interview',
  'Offer',
  'Rejected'
]

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: allowedStatuses,
      default: 'Saved',
    },
    appliedDate: {
  type: Date,
  default: Date.now,
},
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Job', jobSchema)
