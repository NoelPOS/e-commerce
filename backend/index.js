import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './route/auth.route.js'
import productRoutes from './route/product.route.js'

import { connectDB } from './lib/db.js'

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
// app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  connectDB()
  console.log('Server is running on port', PORT)
})
