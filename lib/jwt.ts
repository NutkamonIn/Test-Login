// lib/jwt.ts
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export const generateToken = (userId: number, id: string, permission: string) => {
  const payload = { userId, id, permission };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};