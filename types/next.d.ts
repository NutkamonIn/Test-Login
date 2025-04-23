// types/next.d.ts
import { NextApiRequest } from 'next';

declare module 'next' {
  interface NextApiRequest {
    user?: {
      userId: number;
      id: string;
      permission: string;
    };
  }
}