const express = require('express')

const {
  addJob,
  deleteJob,
  getJobs,
  updateJob,
} = require('../controllers/jobController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.route('/').get(getJobs).post(addJob)
router.route('/:id').put(updateJob).delete(deleteJob)

module.exports = router
