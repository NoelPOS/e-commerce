import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import dotenv from 'dotenv'

dotenv.config()

export const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
      return res.status(400).json({
        message: 'User not authenticated',
      })
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

      const user = await User.findById(decoded.id).select('-password')

      if (!user) {
        return res.status(401).json({
          message: 'User not found',
        })
      }

      req.user = user

      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Token expired',
        })
      }
      throw error
    }
  } catch (error) {
    console.log('Error in protectRoute middleware', error.message)
    return res
      .status(401)
      .json({ message: 'Unauthorized - Invalid access token' })
  }
}
