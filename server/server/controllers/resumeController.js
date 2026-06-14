const ResumeAnalysis =
  require(
    "../models/ResumeAnalysis"
  )

const getHistory =
  async (req, res) => {

    try {

      const history =
        await ResumeAnalysis
          .find({
            userId:
              req.user._id,
          })
          .sort({
            createdAt: -1,
          })

      res.json(history)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })

    }
  }
 const deleteHistory =
  async (req, res) => {
    try {

      console.log(
        "DELETE REQUEST:",
        req.params.id
      )

      await ResumeAnalysis
        .findOneAndDelete({
          _id: req.params.id,
          userId: req.user._id,
        })

      res.json({
        message:
          "Analysis deleted",
      })

    } catch (error) {

      console.error(error)

      res.status(500).json({
        message:
          error.message,
      })

    }
  }
module.exports = {
  getHistory,
  deleteHistory,
}