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
      users: games * 2,
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

export async function getAllUserReferralDetails(req: Request, res: Response) {
  try {
    const user: any = (req?.user as any)?.user;

    const referredUserDetails = await db.user.findUnique({
      where: {
        email: user.email,
      },
      select: {
        referredUsers: true,
        referredBy: true,
        referralId: true,
        commissionDeposits: true,
        totalcommission: true,
      },
    });

    if (!referredUserDetails) {
      console.log("no user");

      return res.status(404).json({ message: "User doesn't exist" });
    }

    const referredUsers = await Promise.all(
      referredUserDetails.referredUsers.map(async (referral) => {
        return await db.user.findUnique({
          where: { id: referral.referrerId },
          select: { name: true, email: true },
        });
      })
    );
    console.log(user, referredUserDetails, referredUsers);
    const referredBy =
      referredUserDetails.referredBy.length > 0
        ? await db.user.findUnique({
            where: { id: referredUserDetails.referredBy[0].referrerId },
            select: { name: true, email: true },
          })
        : null;

    return res.status(200).json({
      referralId: referredUserDetails.referralId,
      referredUsers: referredUsers.filter(Boolean),
      referredBy,
      commissionDeposits: referredUserDetails.commissionDeposits,
      totalCommission: referredUserDetails.totalcommission,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Something Went Wrong!");
  }
}
