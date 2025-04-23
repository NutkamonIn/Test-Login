// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];  // ดึง token จาก header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });  // ตรวจสอบว่า token มีค่าหรือไม่
  }

  const decoded = verifyToken(token);

  if (!decoded || (decoded as { role: string }).role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }

  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error });
  }
}