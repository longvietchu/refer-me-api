import express from 'express';
import { profileController } from '../controllers/profileController';
import passport from 'passport';

// Controllers

// Middlewares
// import validations from '../../middlewares/validations.middleware';

const router = express.Router();
router.post('/create', passport.authenticate('jwt', { session: false}) ,profileController.create);

export default router;
