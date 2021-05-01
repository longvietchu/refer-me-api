import express from 'express';
import passport from 'passport';
import { profileController } from '../controllers/profileController';

const router = express.Router();
router.get('/user/:user_id', profileController.getOne);
router.post(
    '',
    passport.authenticate('jwt', { session: false }),
    profileController.create
);
router.delete(
    '',
    passport.authenticate('jwt', { session: false }),
    profileController.delete
);

export default router;
