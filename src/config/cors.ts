import { CorsOptions } from "cors"

const whitelist = [
  "http://localhost:5173",
  "http://localhost:3000"
]

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {

    if (!origin || whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Error de CORS"))
    }

  }
}