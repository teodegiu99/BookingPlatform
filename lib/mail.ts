import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { to, subject, html, ics } = await req.json();

    // 1. Usa la stessa configurazione di lib/mail.ts (presi dal file .env)
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === "true", // true per 465, false per altre
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Utile se il server ha certificati auto-firmati
      },
    });
    
    // 2. Recupera il mittente dal .env o usa un fallback
    const mailFrom = process.env.MAIL_FROM || 'noreply@baruffa.com';

    const mailOptions: SendMailOptions = {
      from: mailFrom,
      to: to,
      subject,
      html,
      attachments: [],
    };

    // 3. Gestione allegato ICS (invariata)
    if (ics && ics.content && ics.filename) {
      if (!mailOptions.attachments) {
        mailOptions.attachments = [];
      }
      
      mailOptions.attachments.push({
        filename: ics.filename,
        content: ics.content,
        encoding: 'base64',
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
      });
    }

    console.log(`Invio email a: ${Array.isArray(to) ? to.join(', ') : to}`);
    
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore invio email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    return NextResponse.json({ success: false, error: 'Errore invio email', details: errorMessage }, { status: 500 });
  }
}