
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';


export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    const transporter = nodemailer.createTransport({
      host: '127.0.0.1',// Es: smtprelay.tuaazienda.it
      port: Number(process.env.MAIL_PORT) || 25,  // Spesso porta 25 per relay interni
      secure: false,                      // false: no TLS implicito
      tls: {
        rejectUnauthorized: false,        // se usi certificati self-signed
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'noreply@tuaazienda.it', // Deve esistere in Exchange
      to: to.trim(),
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore invio email:', error);
    return NextResponse.json({ success: false, error: 'Errore invio email' }, { status: 500 });
  }
}


