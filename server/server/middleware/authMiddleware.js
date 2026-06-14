const jwt = require("jsonwebtoken")
const User = require("../models/User")

const protect = async (req, res, next) => {

try {


console.log(
  "AUTH HEADER:",
  req.headers.authorization
)

const authHeader =
  req.headers.authorization || ""

const token =
  authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null

console.log(
  "TOKEN:",
  token
)

if (!token) {

  return res.status(401).json({
    message:
      "Authentication required"
  })

}

if (!process.env.JWT_SECRET) {

  return res.status(500).json({
    message:
      "JWT secret is not configured"
  })

}

const decoded =
  jwt.verify(
    token,
    process.env.JWT_SECRET
  )

console.log(
  "DECODED:",
  decoded
)

const user =
  await User.findById(
    decoded.id
  ).select("-password")

console.log(
  "USER:",
  user?._id
)

if (!user) {

  return res.status(401).json({
    message:
      "User no longer exists"
  })

}

req.user = user

next()


} catch (error) {


console.log(
  "JWT ERROR:",
  error.message
)

return res.status(401).json({
  message:
    "Invalid or expired token"
})


}

}

module.exports = {
protect
}
