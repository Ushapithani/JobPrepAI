
const express = require("express")

const {
  analyzeResume,
  askAI,
  getHistory,
  clearHistory,
} = require(
  "../controllers/aiController"
)
const {
  protect,
} = require("../middleware/authMiddleware")

const upload = require("../middleware/upload")

const router = express.Router()

router.use(protect)

router.post(
  "/ask",
  
  upload.any(),
  askAI
)

router.get(
  "/history",
  getHistory
)

router.delete(
  "/history",
  clearHistory
)

router.post(
  "/resume/analyze",
  upload.single("resume"),
  analyzeResume
)
router.get("/test", (req, res) => {
  res.json({ message: "AI Route Working" })
})
module.exports = router