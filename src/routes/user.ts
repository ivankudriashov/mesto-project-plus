import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  findAll, findById, changeProfile, changeAvatar, findUser,
} from '../controllers/user';
import { idValidation } from '../utils/const';
import { url } from '../utils/patterns';

const router = Router();

router.get('/me', findUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: idValidation.required(),
  }),
}), findById);

router.get('/', findAll);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
}), changeProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(url),
  }),
}), changeAvatar);

export default router;
