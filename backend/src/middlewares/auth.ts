import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { verifyToken } from "../utils";

// JWT Authentication Middleware
export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = verifyToken(token);
    let user = await db.user.findFirst({
      where: {
        email: decoded.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        rating: true,
        balance: true,
        role: true,
        status: true,
        emailVerified: true,
        referralId: true,
        referredBy: true,
        referredUsers: true,
        totalcommission: true,
        country: true,
        virtualBalance: true,
      },
    });

    if (!user) return res.status(403).json({ message: "User not found" });
    if (user.status === "SUSPENDED")
      return res
        .status(404)
        .json({ message: "Your account has been suspended" });
    const virtualGameCount = await db.game.count({
      where: {
        OR: [{ blackPlayerId: user.id }, { whitePlayerId: user.id }],
        isVirtual: true,
        status: "COMPLETED",
      },
    });

    let u = { ...user, balance: user.balance, virtualGameCount };
    req.user = { user: u, token };
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

// Middleware to check if the authenticated user is an admin
export const authorizeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: any = (req?.user as any)?.user;

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // If the user is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const authorizeAdminModrator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: any = (req?.user as any)?.user;

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || dbUser.role === "USER") {
      return res
        .status(403)
        .json({ message: "Access denied. Admins and Modrators only." });
    }
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};

export const getUserProfits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: any = (req?.user as any)?.user.id;

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        gamesAsWhite: {
          select: { id: true, status: true, result: true, stake: true },
        },
        gamesAsBlack: {
          select: { id: true, status: true, result: true, stake: true },
        },
        transactions: { select: { id: true, amount: true, status: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const whiteWins = user.gamesAsWhite.filter(
      (game: any) => game.status === "COMPLETED" && game.result === "WHITE_WINS"
    );
    const blackWins = user.gamesAsBlack.filter(
      (game: any) => game.status === "COMPLETED" && game.result === "BLACK_WINS"
    );
    const totalEarnings = [...whiteWins, ...blackWins]
      .map((game) => parseFloat(game.stake))
      .reduce((acc, stake) => acc + stake * 0.85, 0);
    req.user = { ...req.user, totalEarnings };
    console.log(req.user);

    next();
  } catch (e) {
    return res
      .status(500)
      .json({ message: "something happened fetching your profits" });
  }
};

export async function emailVerifiedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req?.user as any)?.user;

  try {
    if (user.emailVerified) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Please verify your email first." });
    }
  } catch (error) {
    console.error("Error in emailVerifiedMiddleware:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during email verification." });
  }
}
