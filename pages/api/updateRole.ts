// pages/api/updateRole.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, newRole } = req.body;
  if (!['user', 'admin', 'moderator'].includes(newRole)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return res.status(200).json({ message: 'Role updated successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating role', error });
  }
};

export default handler;