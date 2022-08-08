import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  create, findAll, deleteCard, dislikeCard, likeCard,
} from '../controllers/card';

const router = Router();

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
}), dislikeCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
}), deleteCard);

router.get('/', findAll);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(20).required(),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().regex(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9-\._~:\/?#\[\]@!\$&'\(\)\*\+,;=]{1,}\.[a-zA-Z]{2,}#{0,1}/).required(),
    owner: Joi.string().alphanum().length(24).required(),
  }),
}), create);

export default router;
