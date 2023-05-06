import { NextFunction, Response } from 'express';
import { QueryOptions, UpdateQuery } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import { ITokenPayload, IUser, SessionRequest } from '../types';
import { STATUS_CODE_200 } from '../constants/status-codes';
import NotFoundError from '../exceptions/notFound';
import ForbiddenError from '../exceptions/forbidden';
import AuthError from '../exceptions/auth';
import ConflictError from '../exceptions/conflict';

export const login = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });

      res.status(STATUS_CODE_200).send({ token });
    })
    .catch(() => next(new AuthError('Необходима авторизация')));
};

export const getUsers = (req: SessionRequest, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(STATUS_CODE_200).send({ data: users }))
    .catch(next);
};

export const getOneUser = (req: SessionRequest, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }

      return res.status(STATUS_CODE_200).send({ data: user });
    })
    .catch(next);
};

export const createUser = (req: SessionRequest, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          }))
          .then((newUser) => res.status(STATUS_CODE_200).send({ data: newUser }));
      } else {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
    })
    .catch(next);
};

const handleUpd = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
  query: UpdateQuery<IUser>,
  options: QueryOptions,
) => {
  const { _id } = req.user as ITokenPayload;

  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } else {
        return user;
      }
    })
    .then((currUser) => {
      if (currUser._id.toString() !== _id) {
        throw new ForbiddenError('У вас нет нужных прав для данной операции');
      } else {
        return User.updateOne({ _id: currUser._id }, query, options)
          .then(() => res.status(STATUS_CODE_200).send({ data: currUser }));
      }
    })
    .catch(next);
};

export const updateProfile = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  handleUpd(
    req,
    res,
    next,
    { name, about },
    { new: true, runValidators: true },
  );
};

export const updateAvatar = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  handleUpd(
    req,
    res,
    next,
    { avatar },
    { new: true, runValidators: true },
  );
};

export const getMyInfo = (req: SessionRequest, res: Response, next: NextFunction) => {
  User.findById(req.user)
    .then((user) => res.status(STATUS_CODE_200).send({ data: user }))
    .catch(next);
};
