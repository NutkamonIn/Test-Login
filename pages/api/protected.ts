// pages/api/protected.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate, authorize } from '@/lib/middleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = req.user; 
  return res.status(200).json({ message: 'Protected data', user });
};


export default authenticate(authorize(['admin'])(handler));