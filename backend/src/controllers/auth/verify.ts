import nodemailer from "nodemailer";
import { generateToken } from "../../utils";
import { db } from "../../db";
import { BACKEND_URL, NODEMAILER_MAIL, NODEMAILER_PASS } from "../../constants";
import { BACKEND_ROUTE } from "../..";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: NODEMAILER_MAIL,
    pass: NODEMAILER_PASS
  }
});
// Function to send email verification
export async function EmailVerification(email: string, name: string) {
  try {
    const token = generateToken(
      {
        data: email,
      },
      "10m"
    );

    const mailConfigurations = {
      from: `${NODEMAILER_MAIL} <no-reply@chessbet.com>`,
      to: email,
      subject: "Email Verification for Your ProChesser Account",
      html: `<p>Dear ${name}</p>
      <p>Thank you for visiting ProChesser! We noticed that you recently entered your email address on our website. To ensure the security of your account and enhance your experience with us, please verify your email by clicking the link below:</p>
      <a href="${BACKEND_URL}/${BACKEND_ROUTE}/auth/verify/${token}">Verify Your Email</a>
      <p>If you have any questions or need assistance, feel free to reach out to our support team at support@prochessser.com<p>
      <p>Thank you for choosing ProChesser!</p>
      <p>Sincerely,</p>
<p>The ProChesser Team</p>
<a href="https://www.prochesser.com/">https://www.prochesser.com/</a>    
      `,
    };

    await transporter.sendMail(mailConfigurations);
    console.log("Email Sent Successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Function to send the forgot password email with a reset link
export const SendForgotPassword = async (email: string, name: string, token: string) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    console.log('Sending: ', token);

    const mailOptions = {
      from: `${NODEMAILER_MAIL} <no-reply@chessbet.com>`,
      to: email,
      subject: "Account Password Reset",
      html: `<p>Dear ${name}</p>
             <p>To reset the password to your ProChesser account, click the link below:</p>
             <a href="${resetLink}">Reset Password</a>
             <p>This link will expire in 10 minutes.</p>
             <p>If you have any questions or need assistance, feel free to reach out to our support team at support@prochessser.com<p>
      <p>Thank you for choosing ProChesser!</p>
      <p>Sincerely,</p>
<p>The ProChesser Team</p>
<a href="https://www.prochesser.com/">https://www.prochesser.com/</a>    
             `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export async function SendModeratorNotification(email: string,name:string, password: string) {
  try {
    const mailOptions = {
      from: `${process.env.GMAIL_USER} <no-reply@chessbet.com>`,
      to: email,
      subject: "Welcome to ProChesser as a Moderator!",
      html: `<p>Hi ${name}</p>
             <p>You’ve been added as a moderator on ProChesser.com! Thank you for joining our team. If you have any questions, feel free to reach out.</p>
             <p>Your temporary password is: <strong>${password}</strong></p>
             <p>Please log in using this password and change it immediately.</p>
             <p>Welcome aboard!</p>
             <p>Sincerely,</p>
             <p>The ProChesser Team</p>
             <a href="https://www.prochesser.com/">https://www.prochesser.com/</a>
             `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Moderator notification email sent successfully");

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function SendUserSuspentionNotification(email: string) {
  try {
    const mailOptions = {
      from: `${process.env.GMAIL_USER} <no-reply@chessbet.com>`,
      to: email,
      subject: "Your Prochesser Account the been suspended",
      html: `<p>Sorry to Inform you that your account has been suspended by the admin. </p>
              <p>If you have any questions or need assistance, please  reach out to our support team at support@prochessser.com</p>
             <p>Sincerely,</p>
             <p>The ProChesser Team</p>
             <a href="https://www.prochesser.com/">https://www.prochesser.com/</a>
      `,
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function SendUserActivationNotification(email: string) {
  try {
    const mailOptions = {
      from: `${process.env.GMAIL_USER} <no-reply@chessbet.com>`,
      to: email,
      subject: "Your ProChesser Account has been Activated",
      html: `<p>Congrats Your Account has been activated</p>
              <p>If you have any questions or need assistance, please  reach out to our support team at support@prochessser.com</p>
             <p>Sincerely,</p>
             <p>The ProChesser Team</p>
             <a href="https://www.prochesser.com/">https://www.prochesser.com/</a>
      `,
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function SendUserBannedNotification(email: string, message: string) {
  try {
    const mailOptions = {
      from: `${process.env.GMAIL_USER} <no-reply@chessbet.com>`,
      to: email,
      subject: "Your Account the been Banned",
      html: `<p>Sorry to Inform you that your account has been Banned Because </p>
      <p>${message}</p>        
      <p>If you have any questions or need assistance, please  reach out to our support team at support@prochessser.com</p>
             <p>Sincerely,</p>
             <p>The ProChesser Team</p>
             <a href="https://www.prochesser.com/">https://www.prochesser.com/</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Moderator notification email sent successfully");

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function WithdrawalRequestNotification(amount: number, id: string) {
  const admins = await db.user.findMany({ where: { role: 'ADMIN' } });
  const mailConfigurations = (email: string) => ({
    from: `${NODEMAILER_MAIL} <no-reply@chessbet.com>`,
    to: email,
    subject: 'Withdrawal Request has been made',
    html: `<p>Kindly check withdrawal request has been made with : </p>
    <p>Id: ${id}</p>
    <p>${amount}</p>
    `
    ,
  });

  admins.forEach((admin: any) => {
    transporter.sendMail(mailConfigurations(admin.email));
  });

  console.log('Emails sent successfully to admins');
}