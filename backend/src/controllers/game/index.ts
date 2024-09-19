import { Request, Response } from "express";
import { db } from "../../db"; 

export const getUserGameHistory = async (req: Request, res: Response) => {
  try {
    const userId = ((req?.user) as any)?.user?.id;

    if (!userId) {
      return res.status(400).json({
        message: "User not found.",
      });
    }

    const games = await db.game.findMany({
      where: {
        OR: [
          { whitePlayerId: userId },
          { blackPlayerId: userId },
        ],
      },
      include: {
        whitePlayer: {
          select: { id: true, name: true },
        },
        blackPlayer: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    
    return res.status(200).json({
      message: "Game history retrieved successfully.",
      games,
    });
  } catch (error) {
    console.error("Error fetching game history:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
