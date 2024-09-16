import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_KEY ?? "SECRET_KEY";

export const generateToken = (obj: Object) => {
  const token = jwt.sign(obj, JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};
