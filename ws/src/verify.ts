import { db } from "./db";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const NODEMAILER_MAIL = process.env.NODEMAILER_MAIL ?? "";
const NODEMAILER_PASS = process.env.NODEMAILER_PASS ?? "";

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: NODEMAILER_MAIL,
    pass: NODEMAILER_PASS,
  },
});

export async function SendRandomPlayNotificationToAdmin(
  gameId: string,
  email: string
) {
  try {
    // Fetch active ActiveUsers with USER role
    const ActiveUsers = await db.user.findMany({
      where: {
        OR: [{ role: "ADMIN" }, { role: "USER" }],
        status: "ACTIVE",
      },
    });

    if (ActiveUsers.length === 0) {
      console.log("No active Active Users found to notify.");
      return;
    }

    // Function to create the email configuration
    const createMailConfig = (email: string) => ({
      from: NODEMAILER_MAIL,
      to: email,
      subject: "New Random Play Created",
      html: `
        <p>A new random game has been created. You can also join it!</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team at support@prochessser.com<p>
        <p>Thank you for choosing ProChesser!</p>
        <p>Sincerely,</p>
        <p>The ProChesser Team</p>
        <a href="https://www.prochesser.com/">https://www.prochesser.com/</a>   
      `,
    });

    // Send email notifications to each admin
    await Promise.all(
      ActiveUsers.map(async (user: any) => {
        try {
          if (user.email !== email)
            await transporter.sendMail(createMailConfig(user.email));
        } catch (emailError) {
          console.error(`Error sending email to ${user.email}:`, emailError);
        }
      })
    );

    console.log("All notification emails have been processed.");
  } catch (error) {
    console.error("Error sending notifications to ActiveUsers:", error);
  }
}
