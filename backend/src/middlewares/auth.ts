import { db } from "../db";
import { bigIntReplacer, verifyToken } from "../utils";

// JWT Authentication Middleware
export const authenticateJWT = async (req: any, res: any, next: any) => {
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
        balance: true
      }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    user = {...user, balance: bigIntReplacer(user.balance)}
    req.user = { user, token };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};
