import { db } from "./db";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const NODEMAILER_MAIL = process.env.NODEMAILER_MAIL ?? "";
const NODEMAILER_PASS = process.env.NODEMAILER_PASS ?? "";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
      user: NODEMAILER_MAIL,
      pass: NODEMAILER_PASS
  }
});


export async function SendRandomPlayNotificationToAdmin(gameId: string) {
  try {
    const admins = await db.user.findMany({ where: { role: 'ADMIN' } });

    const mailConfigurations = (email: string) => ({
      from: `${NODEMAILER_MAIL} <no-reply@chessbet.com>`,
      to: email,
      subject: 'New Random Play Created',
      html: `
        <p>A new user has created a random play with game ID: ${gameId}</p>
        <p>Thanks,</p>
        <p>The ChessBet Team</p>
      `,
    });

    admins.forEach((admin: any) => {
      transporter.sendMail(mailConfigurations(admin.email));
    });

    console.log('Emails sent successfully to admins');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
}
