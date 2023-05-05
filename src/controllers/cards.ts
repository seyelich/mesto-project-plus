import { Response } from 'express';
import mongoose from 'mongoose';
import Сard from '../models/card';
import { CustomRequest } from '../types';
import {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
  STATUS_CODE_200,
} from '../constants/status-codes';
import NotFoundError from '../exceptions/not-found-err';

export const getCards = (req: CustomRequest, res: Response) => {
  Сard.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(STATUS_CODE_200).send({ data: cards });
    })
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' }));
};

export const createCard = (req: CustomRequest, res: Response) => {
  const { name, link } = req.body;

  Сard.create({ name, link, owner: req.user })
    .then((el) => res.send(el))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(ERROR_CODE_400).send({ message: 'Введены неверные данные' });
      }

      return res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' });
    });
};

export const deleteCard = (req: CustomRequest, res: Response) => {
  Сard.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        const error = new NotFoundError('Карточка по указанному _id не найдена');
        throw error;
      }

      return res.status(STATUS_CODE_200).send(card);
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

export const likeCard = (req: CustomRequest, res: Response) => {
  Сard.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        const error = new NotFoundError('Карточка по указанному _id не найдена');
        throw error;
      }

      res.status(STATUS_CODE_200).send({ data: card });
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

export const deleteLikeCard = (req: CustomRequest, res: Response) => {
  Сard.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error = new NotFoundError('Карточка по указанному _id не найдена');
        throw error;
      }

      res.status(STATUS_CODE_200).send({ data: card });
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
