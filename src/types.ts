import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

export interface ITokenPayload {
  _id: string,
  iat :number,
  exp: number,
}

export interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string,
}

export interface CustomError extends Error {
  statusCode: number,
}
