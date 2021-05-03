import express from 'express';
import passport from 'passport';
import { skillController } from '../controllers/skillController';

const router = express.Router();
router.get('/:user_id', skillController.getAllByUserId);
router.post(
    '',
    passport.authenticate('jwt', { session: false }),
    skillController.create
);
router.put('/:skill_id', skillController.update);
router.put('/upvote/:skill_id', skillController.upvote);
router.delete('/:skill_id', skillController.delete);

export default router;
