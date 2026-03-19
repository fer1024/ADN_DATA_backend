import { CorsOptions } from "cors";

// Definimos la lista de dominios permitidos
const whitelist = [
    "http://localhost:5173", 
    "http://localhost:3000", 
    process.env.FRONTEND_URL 
];

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        // 1. Permitir peticiones sin origen (como Postman o herramientas de servidor)
        // 2. O si el origen está en nuestra lista blanca
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            // Si el dominio no está en la lista, lanzamos el error de seguridad
            callback(new Error("Error de CORS: Origen no permitido por ADN DATA"));
        }
    }
};