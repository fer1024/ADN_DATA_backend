// En src/config/nodemailer.ts
const config = () => {
    return {
        host: process.env.SMTP_HOST, // smtp.gmail.com
        port: 587, // Cambia 465 por 587
        secure: false, // OBLIGATORIO: cambiar a false si usas 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS // Las 16 letras de Google
        },
        tls: {
            rejectUnauthorized: false // Esto permite que la conexión pase por el firewall de Render
        }
    }
}