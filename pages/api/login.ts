// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { id, password } = req.body;
  if (!id || !password) return res.status(400).json({ message: 'Missing id or password' });

  const user = await prisma.tb_ap_index_view.findFirst({
    where: { id },
  });
  
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isPasswordValid = await bcrypt.compare(password, user.password || '');
  if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

  const token = generateToken(user.ap_index_view_id, user.id || '', user.permission || 'user');

  return res.status(200).json({ token });
}