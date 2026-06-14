const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

const sanitizeUser = (user) => ({
  _id: user._id,
  email: user.email,
  name: user.name,
})

const signup = async (req, res) => {
  try {
    const { email, name, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({
      email: normalizedEmail,
      name: name.trim(),
      password: hashedPassword,
    })

    res.status(201).json({
      message: 'User registered successfully',
      user: sanitizeUser(user),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    res.status(200).json({
      message: 'Login successful',
      token: createToken(user._id),
      user: sanitizeUser(user),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const changePassword = async (req, res) => {
  try {

    const {
      currentPassword,
      newPassword
    } = req.body

    const user =
      await User.findById(
        req.user._id
      )

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      )

    if (!isMatch) {
      return res.status(400).json({
        message:
          'Current password is incorrect'
      })
    }

    user.password =
      await bcrypt.hash(
        newPassword,
        12
      )

    await user.save()

    res.status(200).json({
      message:
        'Password updated successfully'
    })

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    })

  }
}

module.exports = {
  login,
  signup,
  changePassword,
}