import { db } from "../../db";
import { Request, Response } from "express";

export async function getActiveUsers(req: Request, res: Response) {
  try {
    const games = await db.game.count({
      where: {
        status: "IN_PROGRESS",
      },
    });
    res.status(200).json({
      games,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something Went Wrong!");
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await db.user.count();
    res.status(200).json({
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something Went Wrong!");
  }
}
