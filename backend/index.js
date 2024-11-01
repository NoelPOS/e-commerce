import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './route/auth.route.js'

import { connectDB } from './lib/db.js'

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

app.use('/api/auth', authRoutes)
// app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  connectDB()
  console.log('Server is running on port', PORT)
})
