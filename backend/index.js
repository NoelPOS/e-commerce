import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './route/auth.route.js'
import productRoutes from './route/product.route.js'
import couponRoutes from './route/coupon.route.js'
import cartRoutes from './route/cart.route.js'
import paymentRoutes from './route/payment.route.js'
import analyticsRoutes from './route/analytics.route.js'

import { connectDB } from './lib/db.js'

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)

app.listen(PORT, () => {
  connectDB()
  console.log('Server is running on port', PORT)
})
