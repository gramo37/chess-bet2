import { db } from "./db";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
      user: 'amansample786@gmail.com',
      pass: 'bgwl hcnd wzjg eqix'
  }
});


export async function SendRandomPlayNotificationToAdmin(gameId: string) {
  try {
    const admins = await db.user.findMany({ where: { role: 'ADMIN' } });

    const mailConfigurations = (email: string) => ({
      from: 'amansample786@gmail.com <no-reply@chessbet.com>',
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
