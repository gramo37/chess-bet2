import { db } from "../../db";
import { EmailVerification } from "./verify";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken, verifyToken as jwtVerify } from "../../utils";
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, name, password } = req.body;

    const user = await db.user.findFirst({
      where: {
        email: username,
      },
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    await db.user.create({
      data: {
        email: username,
        password: hashPassword,
        name: name,
      },
    });

    EmailVerification(username);

    res
      .status(200)
      .json({ message: "User created successfully", status: "ok" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await db.user.findFirst({
      where: {
        email: username,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

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

export const verifyToken = async (req: Request, res: Response) => {
  console.log("verify");

  try {
    const decoded = jwtVerify(req.params.token) as {
      data: string;
    };
    console.log(decoded.data);

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

export const logout = async (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      res.status(500).json({ error: "Failed to log out" });
    } else {
      res.clearCookie("jwt");
      res.redirect(`${FRONTEND_URL}`);
    }
  });
};
