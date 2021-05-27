import express from 'express';
import passport from 'passport';
import { experienceController } from '../controllers/experienceController';
import { createExperience } from '../utils/validations';

const router = express.Router();
router.get('', experienceController.getOneById);
router.get('/user', experienceController.getAllByUserId);
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
