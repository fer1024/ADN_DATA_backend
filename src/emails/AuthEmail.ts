import { Resend } from 'resend'
import dotenv from 'dotenv'
dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

const baseStyles = `
    body { margin: 0; padding: 0; background-color: #0f172a; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background-color: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; }
    .header { background-color: #0f172a; padding: 32px; text-align: center; border-bottom: 1px solid #334155; }
    .header-title { margin: 12px 0 0; font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #06b6d4; }
    .header-sub { margin: 6px 0 0; font-size: 11px; letter-spacing: 3px; color: #475569; text-transform: uppercase; }
    .body { padding: 40px 32px; }
    .greeting { font-size: 20px; font-weight: 700; color: #f1f5f9; margin: 0 0 8px; }
    .message { font-size: 14px; color: #94a3b8; line-height: 1.7; margin: 0 0 32px; }
    .token-box { background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 32px; }
    .token-label { font-size: 10px; font-weight: 700; letter-spacing: 3px; color: #475569; text-transform: uppercase; margin: 0 0 12px; }
    .token-value { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #06b6d4; font-family: monospace; margin: 0; }
    .token-expiry { font-size: 11px; color: #475569; margin: 10px 0 0; }
    .btn { display: inline-block; background-color: #0891b2; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 32px; border-radius: 10px; letter-spacing: 1px; }
    .btn-wrapper { text-align: center; margin: 0 0 32px; }
    .divider { border: none; border-top: 1px solid #334155; margin: 32px 0; }
    .footer { padding: 20px 32px; text-align: center; border-top: 1px solid #334155; }
    .footer-text { font-size: 11px; color: #334155; margin: 0; letter-spacing: 2px; text-transform: uppercase; }
    .accent { color: #06b6d4; }
`

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${baseStyles}</style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <div style="display:inline-block;width:48px;height:48px">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 4 Q10 24 18 44" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                        <path d="M30 4 Q38 24 30 44" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                        <line x1="19" y1="10" x2="29" y2="10" stroke="#06b6d4" stroke-width="2" stroke-linecap="round"/>
                        <line x1="15" y1="18" x2="33" y2="18" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round"/>
                        <line x1="13" y1="26" x2="35" y2="26" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/>
                        <line x1="15" y1="34" x2="33" y2="34" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round"/>
                        <line x1="19" y1="40" x2="29" y2="40" stroke="#06b6d4" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <p class="header-title">ADN DATA</p>
                <p class="header-sub">Administración y Control de Datos</p>
            </div>
            ${content}
            <div class="footer">
                <p class="footer-text">&copy; 2026 ADN DATA Engineering &nbsp;·&nbsp; <span class="accent">Pipeline CRISP-DM</span></p>
            </div>
        </div>
    </div>
</body>
</html>`

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {

    static sendConfirmationEmail = async (user: IEmail) => {
        try {
            const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '') || 'https://tayka.shop';

            const html = emailWrapper(`
                <div class="body">
                    <p class="greeting">Hola, ${user.name} 👋</p>
                    <p class="message">
                        Tu cuenta en <strong style="color:#f1f5f9">ADN DATA</strong> ha sido creada exitosamente.<br>
                        Para activarla e iniciar sesión, ingresa el código de confirmación que encontrarás a continuación.
                    </p>

                    <div class="token-box">
                        <p class="token-label">Código de confirmación</p>
                        <p class="token-value">${user.token}</p>
                        <p class="token-expiry">⏱ Este código expira en 30 minutos</p>
                    </div>

                    <div class="btn-wrapper">
                        <a href="${frontendUrl}/auth/confirm-account" class="btn">
                            Confirmar Cuenta
                        </a>
                    </div>

                    <hr class="divider">
                    <p class="message" style="font-size:12px;margin:0">
                        Si no creaste esta cuenta, puedes ignorar este mensaje de forma segura.
                    </p>
                </div>
            `)

            const { data, error } = await resend.emails.send({
                from: 'ADN DATA <admin@tayka.shop>',
                to: user.email,
                subject: 'ADN DATA — Confirma tu cuenta',
                html
            })

            if (error) {
                console.error('❌ Error en sendConfirmationEmail:', error)
            } else {
                console.log('✅ Correo de confirmación enviado:', data?.id)
            }
        } catch (error) {
            console.error('❌ Error en sendConfirmationEmail:', error);
        }
    }

    static sendPasswordResetToken = async (user: IEmail) => {
        try {
            const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '') || 'https://tayka.shop';

            const html = emailWrapper(`
                <div class="body">
                    <p class="greeting">Hola, ${user.name}</p>
                    <p class="message">
                        Recibimos una solicitud para restablecer la contraseña de tu cuenta en
                        <strong style="color:#f1f5f9">ADN DATA</strong>.<br>
                        Usa el código a continuación para crear una nueva contraseña.
                    </p>

                    <div class="token-box">
                        <p class="token-label">Código de restablecimiento</p>
                        <p class="token-value">${user.token}</p>
                        <p class="token-expiry">⏱ Este código expira en 30 minutos</p>
                    </div>

                    <div class="btn-wrapper">
                        <a href="${frontendUrl}/auth/new-password" class="btn">
                            Restablecer Contraseña
                        </a>
                    </div>

                    <hr class="divider">
                    <p class="message" style="font-size:12px;margin:0">
                        Si no solicitaste este cambio, ignora este mensaje.
                    </p>
                </div>
            `)

            const { data, error } = await resend.emails.send({
                from: 'ADN DATA <admin@tayka.shop>',
                to: user.email,
                subject: 'ADN DATA — Restablece tu contraseña',
                html
            })

            if (error) {
                console.error('❌ Error en sendPasswordResetToken:', error)
            } else {
                console.log('✅ Correo de restablecimiento enviado:', data?.id)
            }
        } catch (error) {
            console.error('❌ Error en sendPasswordResetToken:', error);
        }
    }
}
