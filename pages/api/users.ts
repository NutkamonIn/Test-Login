// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (req.method === 'PUT') {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = verifyToken(token);
    if (!decoded || (decoded as { permission: string }).permission !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const { ap_index_view_id, permission, name, lastname, title, sex, birthday } = req.body;
    try {
      const updated = await prisma.tb_ap_index_view.update({
        where: { ap_index_view_id },
        data: {
          permission,
          name,
          lastname,
          title,
          sex,
          birthday: birthday ? new Date(birthday) : null,
        },
      });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating user', error });
    }
  }

  // GET method
  const token = req.headers.authorization?.split(' ')[1];  // ดึง token จาก header
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });  // ตรวจสอบว่า token มีค่าหรือไม่
  }
  const decoded = verifyToken(token);
  if (!decoded || (decoded as { permission: string }).permission !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  try {
    const users = await prisma.tb_ap_index_view.findMany();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error });
  }
}