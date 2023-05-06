import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers,
  updateProfile,
  updateAvatar,
  getOneUser,
  getMyInfo,
} from '../controllers/users';
import urlRegex from '../constants/url';

const router = Router();

router.get('/', getUsers);
router.get('/me', getMyInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  }),
}), getOneUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(200).optional(),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRegex).required(),
  }),
}), updateAvatar);

export default router;
