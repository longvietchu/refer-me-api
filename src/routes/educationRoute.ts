import express from 'express';
import passport from 'passport';
import { educationController } from '../controllers/educationController';
import { createEducation } from '../utils/validations';

const router = express.Router();
router.get('', educationController.getOneById);
router.get('/user', educationController.getAllByUserId);
router.post(
    '',
    [passport.authenticate('jwt', { session: false }), createEducation],
    educationController.create
);
router.put(
    '/:education_id',
    passport.authenticate('jwt', { session: false }),
    educationController.update
);
router.delete(
    '/:education_id',
    passport.authenticate('jwt', { session: false }),
    educationController.delete
);

export default router;
