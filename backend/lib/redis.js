import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

export const client = new Redis(process.env.REDIS_URI)

// await client.set('foo', 'bar')
