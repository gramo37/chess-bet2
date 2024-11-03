import jwt from "jsonwebtoken";
import { db } from "../db";

const SECRET_KEY = process.env.SECRET_KEY ?? "SECRET_KEY";

export const extractUser = async (
  token: string | string[] | null | undefined
) => {
  try {
    if (typeof token === "string") {
      const _user: any = jwt.verify(token, SECRET_KEY);
      const user = await db.user.findFirst({
        where: {
          id: _user?.id,
        },
        select: {
          id: true,
          name: true,
          rating: true,
          balance: true,
          virtualBalance: true,
        },
      });
      return user;
    }
    return null;
  } catch (error) {
    console.log("Error in extracting user", error);
    return null;
  }
};
