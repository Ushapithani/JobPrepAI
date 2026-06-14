const Profile =
  require("../models/Profile")

const getProfile =
  async (req, res) => {
    try {

      const profile =
        await Profile.findOne({
          userId: req.user._id,
        })

      res.json(profile)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })

    }
  }


     const saveProfile = async (req, res) => {
  try {
    console.log("PROFILE SAVE:", req.body)

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        ...req.body,
        userId: req.user._id,
      },
      {
        upsert: true,
        new: true,
      }
    )

    res.json(profile)
  } catch (error) {
  console.error("PROFILE SAVE ERROR:", error)

  res.status(500).json({
    message: error.message,
  })
}
}

module.exports = {
  getProfile,
  saveProfile,
}