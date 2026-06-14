const express = require("express")

const router = express.Router()

const multer = require("multer")

const upload = multer()

const {
  extractSkills,
} = require(
  "../controllers/skillController"
)

const {
  protect,
} = require("../middleware/authMiddleware")

router.post(
  "/extract-skills",
  protect,
  upload.single("resume"),
  extractSkills
)

module.exports = router