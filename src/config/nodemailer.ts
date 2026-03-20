const config = () => {
    return {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false, // CAMBIAR A FALSE PARA EL PUERTO 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false // Esto evita errores de certificados en Render
        }
    }
}

