import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { title } from 'process';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); 
  }

  const { id, password, title, name, lastname, birthday, sex } = req.body;

  if (!id || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const existingUser = await prisma.tb_ap_index_view.findFirst({ where: { id } });

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.tb_ap_index_view.create({
    data: {
      id,
      password: hashedPassword,
      title,
      name,
      lastname,
      birthday: birthday ? new Date(birthday) : null,
      sex,
      editor_id: id,
      permission: 'user',
      timestamp: new Date(),
    },
  });

  return res.status(201).json({ message: 'User registered successfully' });
}