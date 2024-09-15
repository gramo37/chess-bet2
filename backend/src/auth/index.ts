import express from "express";
import { db } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EmailVerification } from "./verify";
const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

router.post("/register", async (req, res) => {
  try {
    const { username, name, password } = req.body;

    const user = await db.user.findFirst({
      where: {
        email: username,
      },
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    await db.user.create({
      data: {
        email: username,
        password: hashPassword,
        name: name,
      },
    });

    EmailVerification(username);

    res.status(200).json({ message: "User created successfully" ,status:'ok'});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal server error" ,status:"error"});
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.user.findFirst({
      where: {
        email: username,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, 'JWTSECRET');

    res.status(200).json({ message: "Login successful", token });
  
      
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// JWT Authentication Middleware
const authenticateJWT =  (req:any, res:any, next:any) => {
 const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'JWTSECRET', async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    const user = await db.user.findFirst({
      where: {
        email:decoded.email,
      },
    });
if(!user)return res.status(404).json({ message: 'User not found' });
    req.user = { user:decoded,token };
    next();
  });
};

// Refresh Route
router.get("/refresh", authenticateJWT, (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({
        user: req.user, 
      });
    } else {
      res.status(401).json({
        user: null,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});


router.get('/verify/:token', async (req, res) => {
  console.log('verify');
  
  try {
    const decoded = jwt.verify(req.params.token, "ourSecretKey") as { data: string };
console.log(decoded.data);

    const user = await db.user.findFirst({
      where: {
        email: decoded.data,
      },
    });

    if (!user) {
console.log('not verified successfully');
      
      return res.status(404).json({ message: 'User not found or invalid token' });
    }
const date =   new Date().toISOString();;
    await db.user.update({
      where: { email: user.email }, 
      data: { emailVerified:date },
    });
console.log('verified successfully');

res.json({message:"Verified"});
  } catch (error) {
    console.error('Error verifying token:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    return res.status(500).json({ message: 'An error occurred while verifying the email' });
  }
});



router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      res.status(500).json({ error: 'Failed to log out' });
    } else {
      res.clearCookie('jwt');
      res.redirect(`${FRONTEND_URL}`);
    }
  });
});

export default router;
