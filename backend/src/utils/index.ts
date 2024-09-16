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

export function bigIntReplacer(value: any): any {
  if (typeof value === "bigint") {
    return value.toString() + "n";
  }
  return value;
}

export function bigIntReviver(value: any): any {
  if (typeof value === "string" && /^\d+n$/.test(value)) {
    return BigInt(value.slice(0, -1));
  }
  return value;
}
