import express from 'express';
import passport from 'passport';
import { notificationController } from '../controllers/noficationController';

const router = express.Router();
router.get('/user', notificationController.getAllByUserId);
router.post(
    '',
    passport.authenticate('jwt', { session: false }),
    notificationController.create
);
router.delete(
    '/:notification_id',
    passport.authenticate('jwt', { session: false }),
    notificationController.delete
);

export default router;
