import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const config = () => {
    return {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        // Si usas el puerto 465, esto debe ser true. Si usas 587, debe ser false.
        secure: process.env.SMTP_PORT === '465', 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    }
}

// ESTA PALABRA ES LA CLAVE:
export const transporter = nodemailer.createTransport(config());