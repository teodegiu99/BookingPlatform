import nodemailer from "nodemailer";

// Configurazione coerente con quella usata nelle API
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || '127.0.0.1',
  port: Number(process.env.MAIL_PORT) || 25,
  secure: false, // true per 465, false per altre porte
  tls: {
    rejectUnauthorized: false,
  },
});

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const emailFrom = process.env.MAIL_FROM || "noreply@baruffa.com";

export const sendTwoFactorTokenEmail = async (
	email: string,
	token: string
  ) => {
	await transporter.sendMail({
	  from: emailFrom,
	  to: email,
	  subject: "Codice 2FA",
	  html: `<p>Il tuo codice di autenticazione: <strong>${token}</strong></p>`
	});
  };

export const sendVerificationEmail = async (
    email: string,
    token: string 
) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    await transporter.sendMail({
        from: emailFrom,
        to: email,
        subject: "Conferma la tua email",
        html: `<p>Clicca <a href="${confirmLink}">qui</a> per confermare la tua email.</p>`
    })
}

export const sendPasswordResetEmail = async (
	email: string,
	token: string
) => {
	const resetLink = `${domain}/auth/new-password?token=${token}`

	await transporter.sendMail({
        from: emailFrom,
        to: email,
        subject: "Reset Password",
        html: `<p>Clicca <a href="${resetLink}">qui</a> per resettare la tua password.</p>`
    })
}