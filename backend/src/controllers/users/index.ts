import { db } from "../../db";
import { Request, Response } from "express";

export async function getActiveUsers(req: Request, res: Response) {
  try {
    const games = await db.game.count({
      where: {
        status: "IN_PROGRESS",
        isVirtual: false,
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
      referredUserDetails.referredUsers.map(async (referral: any) => {
        const u = await db.user.findUnique({
          where: { id: referral.referrerId },
          select: { name: true },
        });
        return { name: u?.name || "User", joinedDate: referral.createdAt };
      })
    );
    // const referredBy =
    //   referredUserDetails.referredBy.length > 0
    //     ? await db.user.findUnique({
    //         where: { id: referredUserDetails.referredBy[0].referredUserId },
    //         select: { name: true },
    //       })
    //     : null;

    const commissionDeposits = await Promise.all(
      referredUserDetails.commissionDeposits.map(async (deposit: any) => {
        const {
          referralId: userId,
          deposit: depositAmount,
          amount,
          createdAt,
        } = deposit;

        const referral = await db.referral.findUnique({
          where: { id: userId },
          select: { referrerId: true },
        });
        const user = await db.user.findUnique({
          where: {
            id: referral?.referrerId,
          },
        });
        console.log(userId, user);

        return {
          deposit: depositAmount,
          amount,
          createdAt,
          user: user?.name || "User", // Provide a fallback if the user is not found
        };
      })
    );

    console.log(commissionDeposits);

    return res.status(200).json({
      referralId: referredUserDetails.referralId,
      referredUsers: referredUsers.filter(Boolean),
      commissionDeposits: commissionDeposits,
      totalCommission: referredUserDetails.totalcommission,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Something Went Wrong!");
  }
}

export async function UpdateAccountBalanceWithCommission(
  req: Request,
  res: Response
) {
  try {
    const user: any = (req?.user as any)?.user;
    console.log("comes here");

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
      return res.status(404).json({ message: "User not found" });
    }
    if (!referredUserDetails.referredUsers.length) {
      return res.status(403).json({ message: "No referred users" });
    }
    if (referredUserDetails.totalcommission <= 50) {
      return res.status(403).json({
        message: "Total commission Earned should be greater or equal $50",
      });
    }

    const today = new Date();
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    console.log(today.getDate(), lastDayOfMonth);

    if (today.getDate() !== lastDayOfMonth) {
      return res.status(403).json({
        message: "Commission can only be withdrawn at the end of the month",
      });
    }

    await db.transaction.create({
      data: {
        amount: referredUserDetails.totalcommission,
        finalamountInUSD: referredUserDetails.totalcommission,
        status: "COMPLETED",
        type: "REFERRAL_COMMISSION",
        userId: user.id,
        platform_charges: 0,
      },
    });

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        balance: {
          increment: referredUserDetails.totalcommission,
        },
        totalcommission: 0,
      },
    });
    res.status(200).json({ message: "Added to the account balance" });
  } catch (e) {
    console.log(e);
    res.status(500).send("Something Went Wrong!");
  }
}
