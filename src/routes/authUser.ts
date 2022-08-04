import { Router } from 'express';

import { changeProfile, changeAvatar } from '../controllers/authUser';

const router = Router();

router.patch('/me', changeProfile);

router.patch('/me/avatar', changeAvatar);

export default router;
