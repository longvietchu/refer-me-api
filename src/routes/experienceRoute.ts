import express from 'express';
import passport from 'passport';
import { experienceController } from '../controllers/experienceController';
import { createExperience } from '../utils/validations';

const router = express.Router();
router.get('/user/:user_id', experienceController.getAllByUserId);
router.get('/:experience_id', experienceController.getOneById);
router.post(
    '',
    passport.authenticate('jwt', { session: false }),
    experienceController.create
);
router.put(
    '/:experience_id',
    [passport.authenticate('jwt', { session: false }), createExperience],
    experienceController.update
);
router.delete(
    '/:experience_id',
    passport.authenticate('jwt', { session: false }),
    experienceController.delete
);

export default router;
