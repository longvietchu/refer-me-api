import express from 'express';
import passport from 'passport';
import { skillController } from '../controllers/skillController';

const router = express.Router();
router.get('/user/:user_id', skillController.getAllByUserId);
router.post(
    '',
    passport.authenticate('jwt', { session: false }),
    skillController.create
);
router.put(
    '/:skill_id',
    passport.authenticate('jwt', { session: false }),
    skillController.update
);
router.put(
    '/upvote/:skill_id',
    passport.authenticate('jwt', { session: false }),
    skillController.upvote
);
router.delete(
    '/:skill_id',
    passport.authenticate('jwt', { session: false }),
    skillController.delete
);

export default router;
