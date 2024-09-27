import nodemailer from "nodemailer";
import { generateToken } from "../../utils";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
      user: 'amansample786@gmail.com',
      pass: 'bgwl hcnd wzjg eqix'
  }
});
// Function to send email verification
export async function EmailVerification(email: string) {
  try {
    const token = generateToken(
      {
        data: email,
      },
      "10m"
    );

    const mailConfigurations = {
      from: `amansample786@gmail.com <no-reply@chessbet.com>`,
      to: email,
      subject: "Email Verification",
      html: `<p>Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email:</p>
           <a href="http://localhost:5000/api/auth/verify/${token}">Verify</a>
           Thanks`,
    };

    await transporter.sendMail(mailConfigurations);
    console.log("Email Sent Successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Function to send the forgot password email with a reset link
export const SendForgotPassword = async (email: string, token: string) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
console.log('Sending: ',token);

    const mailOptions = {
      from: `amansample786@gmail.com <no-reply@chessbet.com>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">Reset Password</a>
             <p>This link will expire in 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export async function SendModeratorNotification(email: string, password:string) {
  try {
    // Generate a random password

    // Configure the email content
    const mailOptions = {
      from: `${process.env.GMAIL_USER} <no-reply@chessbet.com>`,
      to: email,
      subject: "Congratulations! You've been made a Moderator",
      html: `<p>Hello,</p>
             <p>We are excited to inform you that you have been made a moderator on our site.</p>
             <p>Your temporary password is: <strong>${password}</strong></p>
             <p>Please log in using this password and change it immediately.</p>
             <p>Best regards,<br>Your Team at ChessBet</p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Moderator notification email sent successfully");

    return password; // Optionally return the password if you need to store it
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Rethrow error if you want to handle it in a calling function
  }
}