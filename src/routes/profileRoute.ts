import express from 'express';
import passport from 'passport';
import { profileController } from '../controllers/profileController';

const router = express.Router();
router.get('/user/:user_id', profileController.getProfile);
router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    profileController.create
);

export default router;
