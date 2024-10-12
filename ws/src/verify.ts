import { db } from "./db";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const NODEMAILER_MAIL = process.env.NODEMAILER_MAIL ?? "";
const NODEMAILER_PASS = process.env.NODEMAILER_PASS ?? "";


const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465 ,
  secure:true,
  auth: {
    user: NODEMAILER_MAIL,
    pass: NODEMAILER_PASS
  }
});


export async function SendRandomPlayNotificationToAdmin(gameId: string) {
  try {
    const admins = await db.user.findMany({
      where: {
        role: { in: ['ADMIN', 'MODRATOR'] }
      }
    });

     const createMailConfig = (email: string) => ({
      from: NODEMAILER_MAIL,
      to: email,
      subject: 'New Random Play Created',
      html: `
        <p>A new random game has been initiated. Game ID: <strong>${gameId}</strong></p>
        <p>Please review the game at your earliest convenience.</p>
        <p>Thank you,</p>
        <p>The ProChesser Team</p>
      `,
    });

    admins.forEach((admin: any) => {
      transporter.sendMail(createMailConfig(admin.email));
    });

    console.log('Emails sent successfully to admins');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
}
