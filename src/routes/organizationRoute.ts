import express from 'express';
import passport from 'passport';
import { organizationController } from '../controllers/organizationController';

const router = express.Router();

router.get('/all', organizationController.getAll);
router.get('/:organization_id', organizationController.getOne);
router.post(
    '',
    passport.authenticate('jwt', { session: false }),
    organizationController.create
);
router.put(
    '/:organization_id',
    passport.authenticate('jwt', { session: false }),
    organizationController.update
);
router.delete(
    '/:organization_id',
    passport.authenticate('jwt', { session: false }),
    organizationController.delete
);

export default router;
