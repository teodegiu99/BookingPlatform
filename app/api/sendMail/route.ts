// // app/api/sendMail/route.ts
// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// export async function POST(req: Request) {
//   try {
//     const { to, subject, html } = await req.json();

//     const transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       port: Number(process.env.MAIL_PORT) || 465,
//       secure: false,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.MAIL_FROM,
//       to,
//       subject,
//       html,
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Errore invio email:', error);
//     return NextResponse.json({ success: false, error: 'Errore invio email' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const to = body.to;
    const subject = body.subject;
    const html = body.html;

    // Validazione base
    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, error: 'Campi richiesti: to, subject, html' },
        { status: 400 }
      );
    }

    // Creazione transporter per SMTP relay aziendale
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,                // es: smtp.azienda.it
      port: Number(process.env.MAIL_PORT) || 465, 
      secure: false,                              // false per STARTTLS
      auth: {
        user: process.env.MAIL_USER,              // es: relay@azienda.it
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // utile per relay interni con certificati self-signed
      },
    });

    // Invia email
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER, // es: "App Azienda <noreply@azienda.it>"
      to,     // stringa singola o array di email
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore invio email:', error);
    return NextResponse.json(
      { success: false, error: 'Errore invio email' },
      { status: 500 }
    );
  }
}





