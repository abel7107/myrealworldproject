import nodemailer from 'nodemailer';

// Real SMTP when configured; otherwise print the email to the server console
// (development default). Set MAIL_HOST/MAIL_USER/MAIL_PASS in .env to go live.
let transporter = null;

if (process.env.MAIL_HOST && process.env.MAIL_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === 'true',
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });
}

export async function sendMail({ to, subject, text }) {
  if (!transporter) {
    console.log(`\n📧 [DEV EMAIL] To: ${to} | Subject: ${subject}\n${text}\n`);
    return { delivered: false };
  }
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject,
    text,
  });
  return { delivered: true };
}
