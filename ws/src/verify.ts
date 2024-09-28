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


export async function SendRandomPlayNotificationTotheAdmin(){
    try {
    const admins = await db.user.findMany({where:{role:'ADMIN'}})
    admins.forEach((admin)=>{
        const mailConfigurations = {
            from: `amansample786@gmail.com <no-reply@chessbet.com>`,
            to: admin.email,
            subject: "Email Verification",
            html: `<p>A New User Has Created a random play with gameid:</p>

                 Thanks`,
          };
      
        transporter.sendMail(mailConfigurations);
    })

    console.log("Email Sent Successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}