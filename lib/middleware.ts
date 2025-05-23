// lib/middleware.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './jwt'; 
import { permission } from 'process';

export const authenticate = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === 'string') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = decoded as { userId: number; id: string; permission: string }; 

    req.user = user;

    return handler(req, res);
  };
};

export const authorize = (permission: string[]) => {
  return (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = verifyToken(token);
      if (!decoded || typeof decoded === 'string') {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      const user = decoded as { userId: number; id: string; permission: string }; 

      req.user = user;
      if (!permission.includes(decoded.permission)) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
      }

      return handler(req, res);
    };
  };
};
