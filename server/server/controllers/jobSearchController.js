const axios = require("axios")

const searchJobs = async (req, res) => {
  try {
   const query =
  req.query.q || "software engineer"

const location =
  req.query.location || ""

const page = req.query.page || 1

const response = await axios.get(
  `https://api.adzuna.com/v1/api/jobs/in/search/${page}`,
  {
    params: {
      app_id:
        process.env.ADZUNA_APP_ID,

      app_key:
        process.env.ADZUNA_APP_KEY,

      what: query,

      where: location,

      results_per_page: 10,
    },
  }
)

    res.json(response.data.results)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  searchJobs,
}