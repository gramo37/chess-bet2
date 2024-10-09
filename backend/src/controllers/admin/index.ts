import { db } from "../../db";
import bcrypt from "bcrypt";
import { request, Request, Response } from "express";
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
        role: "ADMIN",
        emailVerified: new Date().toISOString()
      },
    });

    const token = generateToken({ id: newUser.id, email: newUser.email });
    EmailVerification(username, name);
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
    const { page } = req.params
    const user: any = (req?.user as any)?.user;
    const role = user.role as string
    const pageNumber = parseInt(page as string) || 1; // Default to page 1 if not provided
    const pageSize = 2; // Number of games per page  
    const transactions = await db.transaction.findMany({
      select: {
        amount: true,
        createdAt: true,
        id: true,
        status: true,
        type: true,
        currency: true,
        user: {
          select: {
            name: true,
            email: true,
            id: true,
          }
        },
      },
        skip: (pageNumber - 1) * pageSize, // Skip games for previous pages
        take: pageSize, // Take only pageSize games
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
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
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
    const { page } = req.params
    const user: any = (req?.user as any)?.user;
    const role = user.role as string
    const pageNumber = parseInt(page as string) || 1; // Default to page 1 if not provided
    const pageSize = 2; // Number of games per page  
    if (role === 'MODRATOR') {
      const users = await db.user.findMany({
        where: { role: 'USER' },
        select: { id: true, name: true, email: true, role: true, status: true }, // Minimal fields
        skip: (pageNumber - 1) * pageSize, // Skip games for previous pages
        take: pageSize, // Take only pageSize games
      });
      res.status(200).json(users);
    } else {
      const users = await db.user.findMany({
        where: {
          OR: [
            { role: 'MODRATOR' },
            { role: 'USER' }
          ]
        },
        select: { id: true, name: true, email: true, role: true, status: true }, // Minimal fields
        skip: (pageNumber - 1) * pageSize, // Skip games for previous pages
        take: pageSize, // Take only pageSize games
      });
      res.status(200).json(users);
    }
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
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        rating: true,
        status: true,
        gamesAsWhite: { select: { id: true, status: true, result: true, stake: true } },
        gamesAsBlack: { select: { id: true, status: true, result: true, stake: true } },
        transactions: { select: { id: true, amount: true, status: true, currency: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const whiteWins = user.gamesAsWhite.filter((game: any) => game.status === 'COMPLETED' && game.result === "WHITE_WINS");
    const blackWins = user.gamesAsBlack.filter((game: any) => game.status === 'COMPLETED' && game.result === 'BLACK_WINS');
    const totalEarnings =
      [...whiteWins, ...blackWins]
        .map(game => parseFloat(game.stake))
        .reduce((acc, stake) => acc + stake * 0.85, 0);
    console.log(whiteWins, blackWins);

    res.status(200).json({ ...user, totalEarnings });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
   
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        rating: true,
        status: true,
        gamesAsWhite: { select: { id: true, status: true, result: true, stake: true } },
        gamesAsBlack: { select: { id: true, status: true, result: true, stake: true } },
        transactions: { select: { id: true, amount: true, status: true, currency: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const whiteWins = user.gamesAsWhite.filter((game: any) => game.status === 'COMPLETED' && game.result === "WHITE_WINS");
    const blackWins = user.gamesAsBlack.filter((game: any) => game.status === 'COMPLETED' && game.result === 'BLACK_WINS');
    const totalEarnings =
      [...whiteWins, ...blackWins]
        .map(game => parseFloat(game.stake))
        .reduce((acc, stake) => acc + stake * 0.85, 0);
    console.log(whiteWins, blackWins);

    res.status(200).json({ ...user, totalEarnings });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGames = async (req: Request, res: Response) => {
  try {
    const { page } = req.params
    const user: any = (req?.user as any)?.user;
    const role = user.role as string
    const pageNumber = parseInt(page as string) || 1; // Default to page 1 if not provided
    const pageSize = 2; // Number of games per page
    const games = await db.game.findMany({
      select: {
        id: true,
        status: true,
        stake: true,
        gameOutCome: true,
        result: true,
        startTime: true,
        endTime: true,
        whitePlayer: { select: { id: true, name: true } },
        blackPlayer: { select: { id: true, name: true } },
      },
      orderBy: {
        startTime: "desc",
      },
      skip: (pageNumber - 1) * pageSize, // Skip games for previous pages
      take: pageSize, // Take only pageSize games
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
      select: {
        id: true,
        status: true,
        result: true,
        startTime: true,
        endTime: true,
        whitePlayer: { select: { id: true, name: true } },
        blackPlayer: { select: { id: true, name: true } },
        board: true, // Include the board state
        Move: { select: { id: true, from: true, to: true, san: true } },
        stake: true,
        gameOutCome: true,
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
  const { page } = req.params;
  try {
    // Fetch all reports with user details, allowing for the possibility that user may be null
    const reports = await db.userReport.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      where: {
        status: "PENDING"
      },
      orderBy: {
        createdAt: 'desc', // Order by created date, latest first
      },
    });



    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function getBannedUsers(req: Request, res: Response) {
  try {
    const user: any = (req?.user as any)?.user;
    const role = user.role as string
 console.log('lkmkslaclas');
 
    if (role === 'MODRATOR') {
      const users = await db.user.findMany({
        where: { 
          status:'BANNED',
          role: 'USER' 
        },
        select: { id: true, name: true, email: true, role: true, status: true },
      });
      res.status(200).json(users);
    } else {
      const users = await db.user.findMany({
        where: {
          status:'BANNED',
          OR: [
            { role: 'MODRATOR' },
            { role: 'USER' }
          ]
        },
        select: { id: true, name: true, email: true, role: true, status: true },
      });
      res.status(200).json(users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Fetch suspended users based on the role of the logged-in user
export async function getSuspendedUsers(req: Request, res: Response) {
  try {
    const user: any = (req?.user as any)?.user;
    const role = user.role as string
    console.log('lkmkslaclas');
    if (role === 'MODRATOR') {
      const users = await db.user.findMany({
        where: { 
          status:'SUSPENDED',
          role: 'USER' 
        },
        select: { id: true, name: true, email: true, role: true, status: true },
      });
      res.status(200).json(users);
    } else {
      const users = await db.user.findMany({
        where: {
          status:'SUSPENDED',
          OR: [
            { role: 'MODRATOR' },
            { role: 'USER' }
          ]
        },
        select: { id: true, name: true, email: true, role: true, status: true },
      });
    console.log(users);

      res.status(200).json(users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getModrators(req:Request,res:Response){
  try{
   const users = await db.user.findMany({
    where:{
      role:'MODRATOR'
    },
    select: { id: true, name: true, email: true, role: true, status: true },
   })
   res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}