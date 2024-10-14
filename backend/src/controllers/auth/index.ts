import { db } from "../../db";
import { EmailVerification, SendForgotPassword } from "./verify";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateReferralTokenUrlFriendly,
  generateToken,
  verifyToken as jwtVerify,
} from "../../utils";
import { connect } from "../../db/redis";
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, name, password, referral } = req.body;

    if (!emailRegex.test(username)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    console.log(password);

    if (password.length <= 6) {
      console.log(password, "anlaks");

      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    const existingUser = await db.user.findFirst({
      where: {
        email: username.toLowerCase(),
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const result = await db.$transaction(async () => {
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);
      const referalToken = generateReferralTokenUrlFriendly(10); // generate a refral token
      const newUser = await db.user.create({
        data: {
          email: username.toLowerCase(),
          password: hashPassword,
          name: name,
          referralId: referalToken,
        },
      });

      if (referral && typeof referral === "string") {
        // Find the referrer by their referral ID
        const referrer = await db.user.findUnique({
          where: {
            referralId: referral,
          },
        });

        // If referrer exists and newUser hasn't been referred yet
        if (referrer) {
          const r = await db.referral.create({
            data: {
              referrer: {
                connect: {
                  id: newUser.id,
                },
              },
              referredUser: {
                connect: {
                  id: referrer.id,
                },
              },
            },
          });
        }
      }
      return newUser;
    });

    const token = generateToken({ id: result.id, email: result.email });
    EmailVerification(username, name);
    res.status(200).json({ message: "User created successfully", token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!emailRegex.test(username)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const user = await db.user.findFirst({
      where: {
        email: username.toLowerCase(),
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (user.status === "SUSPENDED")
      return res
        .status(403)
        .json({ message: "Your account has been suspended" });
    if (user.status === "BANNED")
      return res
        .status(403)
        .json({ message: "Your account has been permanently banned" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      res.status(200).json({
        user: req.user,
      });
    } else {
      res.status(401).json({
        user: null,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const verifiyEmail = async (req: Request, res: Response) => {
  try {
    const user: any = (req?.user as any)?.user;
    console.log("reacnkls");

    if (user.emailVerified) {
      return res.status(400).json({ message: "Already verified" });
    }
    const email = user.email;
    EmailVerification(email, user.name);
    return res.status(200).json({ message: "Email has been sent" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "An error occurred while sending the email" });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  console.log("verify");

  try {
    const decoded = jwtVerify(req.params.token) as {
      data: string;
    };

    const user = await db.user.findFirst({
      where: {
        email: decoded.data,
      },
    });

    if (!user) {
      console.log("not verified successfully");

      return res
        .status(404)
        .json({ message: "User not found or invalid token" });
    }
    const date = new Date().toISOString();
    await db.user.update({
      where: { email: user.email },
      data: { emailVerified: date },
    });
    console.log("verified successfully");

    res.json({ message: "Verified" });
  } catch (error) {
    console.error("Error verifying token:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    return res
      .status(500)
      .json({ message: "An error occurred while verifying the email" });
  }
};

export async function ForgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive", // Case-insensitive comparison
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = generateToken({ id: user.id, email: user.email }, "10m");
    await db.user.update({
      where: { email },
      data: {
        otp: token,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      },
    });

    await SendForgotPassword(email, user.name, token);
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong",
      e,
    });
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (newPassword.length <= 6) {
      console.log(newPassword, "anlaks");
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    let decoded;
    try {
      decoded = jwtVerify(token) as {
        id: string;
        data: string;
      };
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find the user by the decoded token ID and token
    const user = await db.user.findFirst({
      where: {
        id: decoded.id,
        otp: token,
        otpExpiresAt: {
          gte: new Date(), // Check if the token is still valid
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password and clear the reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashPassword,
        otp: null,
        otpExpiresAt: null,
      },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // Verify the token
    let decoded;
    try {
      decoded = jwtVerify(token) as {
        id: string;
        data: string;
      };
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Check if the token matches and has not expired
    const user = await db.user.findFirst({
      where: {
        id: decoded.id,
        otp: token,
        otpExpiresAt: {
          gte: new Date(), // Ensure the token is still valid
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Token is valid
    res.status(200).json({ message: "Token is valid", email: user.email });
  } catch (error) {
    console.error("Error verifying reset token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
