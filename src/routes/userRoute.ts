import express from 'express';
import { userController } from '../controllers/userController';
import passport from 'passport';

// Controllers

// Middlewares
// import validations from '../../middlewares/validations.middleware';

const router = express.Router();
router.get('/current', passport.authenticate('jwt', { session: false}) ,userController.getAll);

export default router;
