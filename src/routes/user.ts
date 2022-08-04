import { Router } from 'express';
import { create, findAll, findById } from '../controllers/user';

const router = Router();

router.get('/:userId', findById);

router.get('/', findAll);

router.post('/', create);

export default router;
