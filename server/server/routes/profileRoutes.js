const express =
  require("express")

const {
  getProfile,
  saveProfile,
} = require(
  "../controllers/profileController"
)

const {
  protect,
} = require(
  "../middleware/authMiddleware"
)

const router =
  express.Router()

router.use(protect)

router.get("/", getProfile)

router.put("/", saveProfile)

module.exports = router