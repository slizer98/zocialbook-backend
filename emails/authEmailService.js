import { createTransport } from '../config/nodemailer.js'

export async function sendEmailVerification({ username, email, token }) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
    )

    const info = await transporter.sendMail({
        from: 'ZocialBook <cuentas@zocialbook.com>',
        to: email,
        subject: 'ZocialBook - Confirma tu cuenta',
        text: 'ZocialBook - Confirma tu cuenta',
        html: `
            <p>Hola: ${username}, confirma tu cuenta en ZocialBook</p>
            <p>Tu cuenta esta casi lista, solo debes confirmarla en es siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/verify/${token}">Confirmar Cuenta</a>
            <p>Si tu no creaste esta cuenta, puedes ignoral este mensaje</p>
            `
    })

    console.log('Mensaje enviado', info.messageId)
}