import nodemailer from 'nodemailer';
 
let transporter = nodemailer.createTransport({
  host: '127.0.0.1', // e.g., mail.yourcompany.com
  port: 25,                         // or another port SMG is listening on (e.g., 587, 465)
  secure: false,                    // Set to true if using port 465
  tls: {
    rejectUnauthorized: false       // Optional: Use only if you have cert issues with SMG
  },
});
 
transporter.sendMail({
  from: '"ZBLB" <zblbfiere@baruffa.com>',
  to: 'dev.matteodegiuseppe@gmail.com',
  subject: 'Test Email through SMG',
  text: 'Hello from Nodemailer through SMG!',
}, (err, info) => {
  if (err) {
    return console.error('Error sending mail:', err);
  }
  console.log('Email sent:', info.response);
});
