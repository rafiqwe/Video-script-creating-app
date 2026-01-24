import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set. Please add it to your environment (e.g. .env.local).");
}

export interface TokenPayload {
  userId: string;
  email: string;
}

export function signAuthToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

export function verifyAuthToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET as string) as TokenPayload;
  } catch {
    return null;
  }
}
