import express from 'express';
import passport from 'passport';
import { connectionController } from '../controllers/connectionController';

const router = express.Router();

router.get(
    '/people',
    passport.authenticate('jwt', { session: false }),
    connectionController.getAll
);
router.get('/detail/:connection_id', connectionController.getOne);
router.get(
    '/invitation',
    passport.authenticate('jwt', { session: false }),
    connectionController.getInvitation
);
router.post(
    '',
    passport.authenticate('jwt', { session: false }),
    connectionController.create
);
router.put(
    '/:connection_id',
    passport.authenticate('jwt', { session: false }),
    connectionController.update
);
router.delete(
    '/:connection_id',
    passport.authenticate('jwt', { session: false }),
    connectionController.delete
);

export default router;
