import { db } from "../../db";
import bcrypt from "bcrypt";
import { Request,Response } from "express";
import { generateToken } from "../../utils";
import { EmailVerification } from "../auth/verify";


export const createAdmin = async (req: Request, res: Response) => {
    try {
      const { username, name, password } = req.body;
  
      const user = await db.user.findFirst({
        where: {
          email: username,
        },
      });
  
      if (user) {
        return res.status(400).json({ message: "admin already exists" });
      }
  
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = await db.user.create({
        data: {
          email: username,
          password: hashPassword,
          name: name,
          role:"ADMIN"
        },
      });
  
      const token = generateToken({ id: newUser.id, email: newUser.email });
      EmailVerification(username);
      res
        .status(200)
        .json({ message: "Admin created successfully", token });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error", status: "error" });
    }
  };

  
  export const adminLogin = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
  
      const user = await db.user.findFirst({
        where: {
          email: username,
          role: "ADMIN", 
        },
      });
  
      if (!user) {
        return res.status(400).json({ message: "Admin does not exist" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }
  
      const token = generateToken({ id: user.id, email: user.email });
  
      res.status(200).json({ message: "Admin login successful", token });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const GetTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await db.transaction.findMany({
      select:{
        amount:true,
        createdAt:true,
        id:true,
        status:true,
        type:true,
        currency:true,
        user:{
          select:{
            name:true,
            email:true,
            id:true,
          }
        }
      }
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const GetTransaction = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const transaction = await db.transaction.findUnique({
        where: { id },
      });
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
  
      res.status(200).json(transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const getUsers = async (req: Request, res: Response) => {
    try {
      const users = await db.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const getUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await db.user.findUnique({
        where: { id },
        include: {
          transactions: true, // Optionally include transaction data
          gamesAsWhite: true, // Include games where user is white player
          gamesAsBlack: true, // Include games where user is black player
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const getGames = async (req: Request, res: Response) => {
    try {
      const games = await db.game.findMany({
        include: {
          whitePlayer: true, // Include white player data
          blackPlayer: true, // Include black player data
        },
      });
      res.status(200).json(games);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const getGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = await db.game.findUnique({
      where: { id },
      include: {
        whitePlayer: true,
        blackPlayer: true,
        Move: true, 
      },
    });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error("Error fetching game:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllReports = async (req: Request, res: Response) => {
    try {
      // Fetch all reports, selecting only the title, description, and user details
      const reports = await db.userReport.findMany({
        select: {
          title: true,
          description: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc", 
        },
      });
  
      res.status(200).json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };