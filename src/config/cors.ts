import { CorsOptions } from 'cors'

const whitelist = [
    'http://localhost:5173',
    'https://tayka.shop',
    'https://www.tayka.shop',
    process.env.FRONTEND_URL,
].filter(Boolean) as string[]

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error(`CORS bloqueado para origen: ${origin}`))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}