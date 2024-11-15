import express from 'express'
import {
  signup,
  login,
  logout,
  refreshToken,
  getProfile,
} from '../controller/auth.controller.js'

import { protectedRoute } from '../utils/protectedRoute.js'

const router = express.Router()

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.post('/refreshtoken', refreshToken)

router.get('/profile', protectedRoute, getProfile)

export default router
