import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

export const client = new Redis(process.env.REDIS_URI)

console.log(client.get('refreshToken:678e6531d82f74dea55d31fb'))

// await client.set('foo', 'bar')

// await client.set('hello', 'world')

