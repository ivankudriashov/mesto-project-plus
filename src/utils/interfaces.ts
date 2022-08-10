import { Request } from 'express';

export interface SessionRequest extends Request {
  user?: {
    _id: string;
  }
}

export interface SessionError extends Error {
  statusCode: number,
  message: string
}
