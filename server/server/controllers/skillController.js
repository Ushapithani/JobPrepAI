const pdf = require("pdf-parse")
const mammoth = require("mammoth")

const SKILLS_DB = [
  "python",
  "java",
  "javascript",
  "react",
  "node.js",
  "mongodb",
  "mysql",
  "sql",
  "html",
  "css",
  "git",
  "github",
  "aws",
  "docker",
  "kubernetes",
  "machine learning",
  "deep learning",
  "artificial intelligence",
  "tensorflow",
  "pytorch",
  "express",
  "c++",

  // QA Skills
  "qa",
  "quality assurance",
  "testing",
  "manual testing",
  "automation testing",
  "test cases",
  "test scripts",
  "bug tracking",
  "jira",
  "documentation",
  "selenium",
  "postman",

]

const extractSkills = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file required",
      })
    }

    let text = ""

    if (
      req.file.mimetype ===
      "application/pdf"
    ) {

      const pdfData =
        await pdf(req.file.buffer)

      text = pdfData.text

    }

    else if (
      req.file.mimetype.includes(
        "wordprocessingml"
      )
    ) {

      const docData =
        await mammoth.extractRawText({
          buffer: req.file.buffer,
        })

      text = docData.value

    }

    else {

      return res.status(400).json({
        message:
          "Only PDF and DOCX files are supported",
      })

    }

    text = text.toLowerCase()

   const foundSkills =
  SKILLS_DB.filter(skill => {

    const regex =
      new RegExp(
        `\\b${skill.replace(/\+/g,"\\+")}\\b`,
        "i"
      )

    return regex.test(text)

  })

    res.status(200).json({
      skills: foundSkills,
    })

  }

  catch (error) {

    console.error(error)

    res.status(500).json({
      message:
        "Skill extraction failed",
    })

  }

}

module.exports = {
  extractSkills,
}