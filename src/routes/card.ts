import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  create, findAll, deleteCard, dislikeCard, likeCard,
} from '../controllers/card';
import { idValidation } from '../utils/const';
import { url } from '../utils/patterns';

const router = Router();

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: idValidation.required(),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: idValidation.required(),
  }),
}), dislikeCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: idValidation.required(),
  }),
}), deleteCard);

router.get('/', findAll);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(url).required(),
  }),
}), create);

export default router;
