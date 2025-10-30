import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
// Importa il tipo se usi TypeScript in modo stretto, altrimenti puoi ometterlo
import { SendMailOptions } from 'nodemailer'; 

export async function POST(req: Request) {
  try {
    // 1. Estrai 'ics' dal body della richiesta
    const { to, subject, html, ics } = await req.json();

    const transporter = nodemailer.createTransport({
      host: '127.0.0.1',// Es: smtprelay.tuaazienda.it
      port: Number(process.env.MAIL_PORT) || 25,  // Spesso porta 25 per relay interni
      secure: false,                      // false: no TLS implicito
      tls: {
        rejectUnauthorized: false,        // se usi certificati self-signed
      },
    });
    
    // 2. Definisci le opzioni di base della mail
    // Usiamo il tipo SendMailOptions per la robustezza
    const mailOptions: SendMailOptions = {
      from: process.env.MAIL_FROM || 'noreply@baruffa.com', // Deve esistere in Exchange
      to: to,
      subject,
      html,
      attachments: [], // Inizializza array per gli allegati
    };

    // 3. Aggiungi l'allegato ICS se è stato fornito
    if (ics && ics.content && ics.filename) {
      // Assicurati che 'attachments' sia definito
      if (!mailOptions.attachments) {
        mailOptions.attachments = [];
      }
      
      mailOptions.attachments.push({
        filename: ics.filename,
        content: ics.content, // Il contenuto è già in Base64
        encoding: 'base64',   // Specifica a nodemailer che è Base64
        contentType: 'text/calendar; charset=utf-8; method=REQUEST', // Mime-type corretto
      });
    }

    console.log(`Invio email a: ${Array.isArray(to) ? to.join(', ') : to} con allegato ICS: ${!!ics}`);
    
    // 4. Invia la mail con le opzioni (incluso l'allegato se presente)
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore invio email:', error);
    // Fornisci un errore più dettagliato in console
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    console.error(errorMessage);
    return NextResponse.json({ success: false, error: 'Errore invio email', details: errorMessage }, { status: 500 });
  }
}