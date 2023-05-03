import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateProfile,
  updateAvatar,
  getOneUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getOneUser);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;
