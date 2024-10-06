import { Request, Response } from "express";
import { db } from "../../db"; 

export const getUserGameHistory = async (req: Request, res: Response) => {
  const { page } = req.params; // Use query params to pass page number
  const pageNumber = parseInt(page as string) || 1; // Default to page 1 if not provided
  const pageSize = 8; // Number of games per page

  try {
    const userId = ((req?.user) as any)?.user?.id;

    if (!userId) {
      return res.status(400).json({
        message: "User not found.",
      });
    }

    const games = await db.game.findMany({
      where: {
        OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
      },
      include: {
        whitePlayer: { select: { id: true, name: true } },
        blackPlayer: { select: { id: true, name: true } },
      },
      orderBy: {
        startTime: "desc",
      },
      skip: (pageNumber - 1) * pageSize, // Skip games for previous pages
      take: pageSize, // Take only pageSize games
    });

    const totalGames = await db.game.count({
      where: {
        OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
      },
    });

    return res.status(200).json({
      message: "Game history retrieved successfully.",
      games,
      totalGames,
    });
  } catch (error) {
    console.error("Error fetching game history:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
