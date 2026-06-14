require('dotenv').config()

const cors = require('cors')
const express = require('express')

const connectDB = require('./config/db')
const aiRoutes = require('./routes/aiRoutes')
const authRoutes = require('./routes/authRoutes')
const jobRoutes = require('./routes/jobRoutes')
const skillRoutes =require('./routes/skillRoutes')
const jobSearchRoutes =
  require("./routes/jobSearchRoutes")
const profileRoutes =
  require(
    "./routes/profileRoutes"
  )
const resumeRoutes =
  require(
    "./routes/resumeRoutes"
  )
const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'https://careerforge-ai-one.vercel.app',
]

app.use(
  cors({
     origin: true,
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
  }),
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({
  extended: true,
  limit: '10mb',
}))

app.get('/', (req, res) => {
  res.send('CareerForge AI Backend Running...')
})
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/skills',skillRoutes)
app.use(
  "/api/profile",
  profileRoutes
)
app.use(
  "/api/resume",
  resumeRoutes
)
app.use(
  "/api/job-search",
  jobSearchRoutes
)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ message: 'Internal server error' })
})

const PORT = process.env.PORT || 5000

connectDB()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
