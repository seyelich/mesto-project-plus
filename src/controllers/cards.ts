import { NextFunction, Response } from 'express';
import Card from '../models/card';
import { ITokenPayload, SessionRequest } from '../types';
import { STATUS_CODE_200 } from '../constants/status-codes';
import NotFoundError from '../exceptions/notFound';
import ForbiddenError from '../exceptions/forbidden';

export const getCards = (req: SessionRequest, res: Response, next: NextFunction) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(STATUS_CODE_200).send({ data: cards }))
    .catch(next);
};

export const createCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user })
    .then((el) => res.status(STATUS_CODE_200).send({ data: el }))
    .catch(next);
};

export const deleteCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { _id } = req.user as ITokenPayload;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка по указанному _id не найдена');
      } else {
        return card;
      }
    })
    .then((card) => {
      if (card.owner.toString() !== _id) {
        throw new ForbiddenError('У вас нет нужных прав для данной операции');
      } else {
        return Card.deleteOne({ _id: cardId })
          .then(() => res.status(STATUS_CODE_200).send({ data: card }));
      }
    })
    .catch(next);
};

export const likeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user } },
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
    .catch(next);
};

export const deleteLikeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error = new NotFoundError('Карточка по указанному _id не найдена');
        throw error;
      }

      res.status(STATUS_CODE_200).send({ data: card });
    })
    .catch(next);
};
