import { Request,Response,NextFunction } from "express";
import { db } from "../db";
import { verifyToken } from "../utils";

// JWT Authentication Middleware
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
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
        role:true,
        status:true
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    if(user.status === 'SUSPENDED') return res.status(404).json({ message: "Your account has been suspended" });
    user = {...user, balance: user.balance}
    req.user = { user, token };
    next();
  } catch (error) {
    console.log(error)
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};


// Middleware to check if the authenticated user is an admin
export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
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

export const authorizeAdminModrator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: any = (req?.user as any)?.user; 

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || dbUser.role === "USER") {
      return res.status(403).json({ message: "Access denied. Admins and Modrators only." });
    }
    next();
  } catch (error) {

    console.error("Authorization error:", error);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};
