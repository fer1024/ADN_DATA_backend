import { CorsOptions } from 'cors' // <-- Esta es la línea que te falta

const whitelist = [
  "http://localhost:5173",
  process.env.FRONTEND_URL 
]

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // Si el origen está en la whitelist o no hay origen (como Postman)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Error de CORS"))
    }
  }
}