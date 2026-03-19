import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const config = () => {
    return {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true, // Obligatorio para el puerto 465
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }
}

export const transporter = nodemailer.createTransport(config());

