import { db } from "../../db";
import bcrypt from "bcrypt";
import { Request,Response } from "express";
import { generateRandomPassword, generateToken } from "../../utils";
import { EmailVerification, SendModeratorNotification } from "../auth/verify";


export const createModrator = async (req: Request, res: Response) => {
    try {
      const { username, name} = req.body;
      const password =  generateRandomPassword(8)
      const user = await db.user.findFirst({
        where: {
          email: username,
        },
      });
  
      if (user) {
        return res.status(400).json({ message: "Modrator already exists" });
      }
  
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = await db.user.create({
        data: {
          email: username,
          password: hashPassword,
          name: name,
          role:"MODRATOR",
          emailVerified:new Date().toISOString()
        },
      });
  
      SendModeratorNotification(username,name,password)
      res
        .status(200)
        .json({ message: "Modrator created successfully and mail has been sent to there email address" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error", status: "error" });
    }
  };

  
