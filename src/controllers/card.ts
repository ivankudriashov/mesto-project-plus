import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { SessionRequest } from '../utils/interfaces';
import { NotFoundError, ProfileError } from '../errors/errors';

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.id;

  return Card.deleteOne({ _id })
    .then(() => { res.status(200).send({}); })
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          next(new NotFoundError('Такой карточки не существует.'));
          break;
        default: next(err);
      }
    });
};

export const findAll = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

export const create = (req: SessionRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;

  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: _id,
  }).then(() => {
    res.status(201).send({
    });
  }).catch((err) => {
    switch (err.name) {
      case 'ValidationError':
        next(new ProfileError('Переданы некорректные данные при создании пользователя.'));
        break;
      case 'CastError':
        next(new NotFoundError('Такой карточки не существует.'));
        break;
      default: next(err);
    }
  });
};

export const likeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;

  return Card.findCardAndChangeLike(
    req.params.cardId,
    { $addToSet: { likes: _id } },
  ).then(() => {
    res.status(200).send({});
  }).catch((err) => {
    switch (err.name) {
      case 'CastError':
        next(new NotFoundError('Такого пользователя не существует.'));
        break;
      default: next(err);
    }
  });
};

export const dislikeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;

  return Card.findCardAndChangeLike(
    req.params.cardId,
    { $pull: { likes: _id } },
  ).then(() => {
    res.status(200).send({});
  }).catch((err) => {
    switch (err.name) {
      case 'CastError':
        next(new NotFoundError('Такого пользователя не существует.'));
        break;
      default: next(err);
    }
  });
};
