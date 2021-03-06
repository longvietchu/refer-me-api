import express from 'express';
import passport from 'passport';
import { organizationController } from '../controllers/organizationController';

const router = express.Router();

router.get('', organizationController.getAll);
router.get('/search', organizationController.search);
router.get('/detail/:organization_id', organizationController.getOne);
router.get('/my-organizations', organizationController.getOrgOfUser);
router.post(
    '',
    passport.authenticate('jwt', { session: false }),
    organizationController.create
);
router.put(
    '/update/:organization_id',
    passport.authenticate('jwt', { session: false }),
    organizationController.update
);
router.delete(
    '/:organization_id',
    passport.authenticate('jwt', { session: false }),
    organizationController.delete
);

export default router;
