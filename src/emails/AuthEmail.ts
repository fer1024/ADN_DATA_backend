import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const config = () => {
    return {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT === '465', // true para 465, false para 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false // Ayuda a evitar bloqueos en Render
        }
    }
}

// ESTA LÍNEA ES LA QUE CORRIGE EL ERROR:
export const transporter = nodemailer.createTransport(config());