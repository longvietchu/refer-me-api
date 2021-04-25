import express from 'express';
import passport from 'passport';
import { userController } from '../controllers/userController';

const router = express.Router();
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    userController.getCurrent
);

export default router;
