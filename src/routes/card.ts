import { Router } from 'express';
import {
  create, findAll, deleteCard, dislikeCard, likeCard,
} from '../controllers/card';

const router = Router();

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

router.delete('/:cardId', deleteCard);

router.get('/', findAll);

router.post('/', create);

export default router;
