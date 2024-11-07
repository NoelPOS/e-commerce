import User from '../models/user.model.js'

export const adminRoute = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return next()
    } else {
      return res
        .status(401)
        .json({ message: 'Unauthorized - Admin access only' })
    }
  } catch (error) {
    console.log('Error in adminRoute middleware', error.message)
    return res.status(401).json({ message: 'Unauthorized - Admin access only' })
  }
}
