const express = require("express")
const {
  searchJobs,
} = require("../controllers/jobSearchController")

const router = express.Router()

router.get("/search", searchJobs)

module.exports = router