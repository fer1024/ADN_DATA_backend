import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const config = () => {
    return {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        // IMPORTANTE: secure debe ser false si usas el puerto 587
        secure: false, 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    }
}

// CRÍTICO: Asegúrate de que esta línea esté al final y tenga la palabra "export"
export const transporter = nodemailer.createTransport(config());