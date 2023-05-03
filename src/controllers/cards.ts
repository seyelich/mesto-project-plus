import { Response } from 'express';
import Сard from '../models/card';
import { CustomRequest } from '../types';
import {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
  STATUS_CODE_200,
} from '../constants/status-codes';
import NotFoundError from '../exceptions/not-found-err';
import ClientError from '../exceptions/client-err';

export const getCards = (req: CustomRequest, res: Response) => {
  Сard.find({})
    .populate('owner')
    .then((cards) => {
      res.status(STATUS_CODE_200).send({ data: cards });
    })
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' }));
};

export const createCard = (req: CustomRequest, res: Response) => {
  const { name, link } = req.body;

  if (!name || !link) {
    const error = new ClientError('Переданы некорректные данные');
    throw error;
  }

  Сard.create({ name, link, owner: req.user })
    .then((el) => res.send(el))
    .catch((err) => {
      if (err instanceof Error && err.name === 'ClientError') {
        return res.status(ERROR_CODE_400).send({ message: err.message });
      }

      return res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' });
    });
};

export const deleteCard = (req: CustomRequest, res: Response) => {
  Сard.findByIdAndDelete(req.params.id)
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

      if (!req.user) {
        const error = new ClientError('Переданы некорректные данные');
        throw error;
      }

      res.status(STATUS_CODE_200).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof Error && err.name === 'NotFound') {
        return res.status(ERROR_CODE_404).send({ message: err.message });
      }

      if (err instanceof Error && err.name === 'ClientError') {
        return res.status(ERROR_CODE_400).send({ message: err.message });
      }

      return res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' });
    });
};

export const deleteLikeCard = (req: CustomRequest, res: Response) => {
  Сard.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error = new NotFoundError('Карточка по указанному _id не найдена');
        throw error;
      }

      if (!req.user) {
        const error = new ClientError('Переданы некорректные данные');
        throw error;
      }

      res.status(STATUS_CODE_200).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof Error && err.name === 'NotFound') {
        return res.status(ERROR_CODE_404).send({ message: err.message });
      }

      if (err instanceof Error && err.name === 'ClientError') {
        return res.status(ERROR_CODE_400).send({ message: err.message });
      }

      return res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка' });
    });
};
