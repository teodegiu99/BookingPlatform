import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';

const createTransporter = () => {
  const host = process.env.MAIL_HOST;
  const port = Number(process.env.MAIL_PORT);

  if (!host) {
    throw new Error('MAIL_HOST non configurata');
  }

  if (!Number.isFinite(port)) {
    throw new Error('MAIL_PORT non configurata o non valida');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.MAIL_SECURE === 'true',
    auth:
      process.env.MAIL_USER && process.env.MAIL_PASS
        ? {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        }
        : undefined,
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export async function POST(req: Request) {
  try {
    const { to, subject, html, ics } = await req.json();

    if (!to || (Array.isArray(to) && to.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Destinatario mancante' },
        { status: 400 }
      );
    }

    const transporter = createTransporter();

    const mailOptions: SendMailOptions = {
      from: process.env.MAIL_FROM || 'noreply@baruffa.com',
      to,
      subject,
      html,
      attachments: [],
    };

    if (ics && ics.content && ics.filename) {
      mailOptions.attachments?.push({
        filename: ics.filename,
        content: ics.content,
        encoding: 'base64',
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
      });
    }

    console.log(
      `Invio email a: ${Array.isArray(to) ? to.join(', ') : to} con allegato ICS: ${!!ics}`
    );

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    console.error('Errore invio email:', errorMessage);

    return NextResponse.json(
      { success: false, error: 'Errore invio email', details: errorMessage },
      { status: 500 }
    );
  }
}