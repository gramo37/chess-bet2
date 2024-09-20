import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_KEY ?? "SECRET_KEY";

export const generateToken = (obj: Object, expiresIn: string = "1h") => {
  const token = jwt.sign(obj, JWT_SECRET, {
    expiresIn,
  });
  return token;
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded;
};

