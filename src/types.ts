import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: { _id: string };
}

export interface IUser {
  name: string,
  about: string,
  avatar: string,
}

export interface CustomError extends Error {
  name: string,
  statusCode: number,
}
