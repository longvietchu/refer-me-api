import express from 'express';
import passport from 'passport';
import { organizationController } from '../controllers/organizationController';

const router = express.Router();
router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    organizationController.create
);
router.put(
    '/update/:organization_id',
    passport.authenticate('jwt', { session: false }),
    organizationController.update
);
router.get('/all', organizationController.getAll);
router.get('/:organization_id', organizationController.getOrganization);

export default router;
