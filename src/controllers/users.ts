import { Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import { CustomRequest } from '../types';
import {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
  STATUS_CODE_200,
} from '../constants/status-codes';
import NotFoundError from '../exceptions/not-found-err';

export const getUsers = (req: CustomRequest, res: Response) => {
  User.find({})
    .then((users) => res.status(STATUS_CODE_200).send({ data: users }))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' }));
};

export const getOneUser = (req: CustomRequest, res: Response) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        const error = new NotFoundError('Пользователь по указанному _id не найден');
        throw error;
      }

      return res.status(STATUS_CODE_200).send(user);
    })
    .catch((err) => {
      if ((err instanceof Error && err.name === 'NotFound')) {
        return res.status(ERROR_CODE_404).send({ message: err.message });
      }

      if ((err instanceof mongoose.Error.CastError)) {
        return res.status(ERROR_CODE_400).send({ message: 'Введены неверные данные' });
      }

      return res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' });
    });
};

export const createUser = (req: CustomRequest, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CODE_200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_CODE_400).send({ message: 'Введены неверные данные' });
      }

      return res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' });
    });
};

export const updateProfile = (req: CustomRequest, res: Response) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        const error = new NotFoundError('Пользователь по указанному _id не найден');
        throw error;
      }

      res.status(STATUS_CODE_200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof Error && err.name === 'NotFound') {
        return res.status(ERROR_CODE_404).send({ message: err.message });
      }

      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_CODE_400).send({ message: 'Введены неверные данные' });
      }

      return res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' });
    });
};

export const updateAvatar = (req: CustomRequest, res: Response) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        const error = new NotFoundError('Пользователь по указанному _id не найден');
        throw error;
      }

      res.status(STATUS_CODE_200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof Error && err.name === 'NotFound') {
        return res.status(ERROR_CODE_404).send({ message: err.message });
      }

      if (err instanceof mongoose.Error.CastError) {
        return res.status(ERROR_CODE_400).send({ message: 'Введены неверные данные' });
      }

      return res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' });
    });
};
