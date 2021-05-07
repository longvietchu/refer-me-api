import express from 'express';
import passport from 'passport';
import { jobController } from '../controllers/jobController';

const router = express.Router();
router.get('', jobController.getAll);
router.get('/search', jobController.search);
router.get('/:job_id', jobController.getOne);
router.post(
    '',
    passport.authenticate('jwt', { session: false }),
    jobController.create
);
router.put(
    '/:job_id',
    passport.authenticate('jwt', { session: false }),
    jobController.update
);
router.delete(
    '/:job_id',
    passport.authenticate('jwt', { session: false }),
    jobController.delete
);

export default router;
