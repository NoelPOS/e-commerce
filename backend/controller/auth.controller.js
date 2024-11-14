import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { client } from '../lib/redis.js'

const generateToken = (id) => {
  try {
    const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    })

    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log(error)
  }
}

const storeRefreshToken = async (refreshToken, id) => {
  try {
    await client.set(`refreshToken:${id}`, refreshToken)
  } catch (error) {
    console.log(error)
  }
}

const setCookies = (res, accessToken, refreshToken) => {
  try {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
  } catch (error) {
    console.log(error)
  }
}

export const signup = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const userExists = await User.findOne({
      email,
    })

    if (userExists) {
      return res.status(400).json({
        error: 'User already exists',
      })
    }

    const user = await User.create({
      name,
      email,
      password,
    })

    const { accessToken, refreshToken } = generateToken(user._id)

    await storeRefreshToken(refreshToken, user._id)

    setCookies(res, accessToken, refreshToken)

    res.status(201).json({
      user,
      message: 'User created successfully',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error.message,
    })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      })
    }

    const { accessToken, refreshToken } = generateToken(user._id)

    await storeRefreshToken(refreshToken, user._id)

    setCookies(res, accessToken, refreshToken)

    res.status(200).json({
      user,
      message: 'User logged in successfully',
    })
  } catch (error) {
    console.log(error)
  }
}

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

      await client.del(`refreshToken:${decoded.id}`)
    }

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(200).json({
      message: 'User logged out successfully',
    })
  } catch (error) {
    console.log(error)
  }
}

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.status(400).json({
        message: 'User not authenticated',
      })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    const fromRedis = await client.get(`refreshToken:${decoded.id}`)

    if (refreshToken !== fromRedis) {
      return res.status(400).json({
        message: 'Invalid refresh token',
      })
    }

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: '15m',
      }
    )

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })

    res.status(200).json({
      message: 'Token refreshed successfully',
    })
  } catch (error) {
    console.log(error)
  }
}
