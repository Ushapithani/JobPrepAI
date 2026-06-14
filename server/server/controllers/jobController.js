const mongoose = require('mongoose')

const Job = require('../models/Job')

const allowedStatuses = [
  'Saved',
  'Applied',
  'Interview',
  'Offer',
  'Rejected'
]

const validateJobPayload = ({ company, role, status }) => {
  if (!company || !role) {
    return 'Company and role are required'
  }

  if (status && !allowedStatuses.includes(status)) {
    return 'Invalid job status'
  }

  return null
}

const addJob = async (req, res) => {
  try {
    const validationError = validateJobPayload(req.body)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const {
  company,
  location = '',
  notes = '',
  role,
  status = 'Saved',
} = req.body

    const newJob = await Job.create({
      company,
      location,
      notes,
      role,
      status,
      userId: req.user._id,
    })

    res.status(201).json(newJob)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json(jobs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid job id' })
    }

    const validationError = validateJobPayload(req.body)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        company: req.body.company,
        location: req.body.location || '',
        notes: req.body.notes || '',
        role: req.body.role,
        status: req.body.status || 'Saved',
      },
      { new: true, runValidators: true },
    )

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' })
    }

    res.status(200).json(updatedJob)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid job id' })
    }

    const deletedJob = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' })
    }

    res.status(200).json({ message: 'Job deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  addJob,
  deleteJob,
  getJobs,
  updateJob,
}
