// app/api/sendMail/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 465,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore invio email:', error);
    return NextResponse.json({ success: false, error: 'Errore invio email' }, { status: 500 });
  }
}
