import nodemailer from 'nodemailer'; // Ya no debería marcar error en rojo
import dotenv from 'dotenv';
dotenv.config();

const config = () => {
    return {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false, // Obligatorio para puerto 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    }
}

export const transporter = nodemailer.createTransport(config());