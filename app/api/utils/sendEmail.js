import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export default async function sendEmail({ to, subject, text }) {
  console.log("📨 Attempting to send email to:", to); 
  try {
    const info = await transporter.sendMail({
      from: '"Rent App" <no-reply@rentapp.com>',
      to,
      subject,
      text,
    });
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}
