import express from 'express';
import passport from 'passport';
import { jobController } from '../controllers/jobController';

const router = express.Router();
router.get('', jobController.getAll);
router.get('/organization', jobController.getJobOfOrganization);
router.get('/search', jobController.search);
router.get('/detail/:job_id', jobController.getOne);
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
// Applicants
router.get(
    '/applicants',
    passport.authenticate('jwt', { session: false }),
    jobController.getAllApplicants
);
router.post(
    '/apply/:job_id',
    passport.authenticate('jwt', { session: false }),
    jobController.applyJob
);
router.delete(
    '/un-apply/:job_id',
    passport.authenticate('jwt', { session: false }),
    jobController.unApply
);
router.get(
    '/is-applied',
    passport.authenticate('jwt', { session: false }),
    jobController.isApplied
);

export default router;
