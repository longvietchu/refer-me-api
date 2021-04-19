import express from 'express';

// Controllers
import { authController } from '../controllers/authController';

// Middlewares
// import validations from '../../middlewares/validations.middleware';

const router = express.Router();
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
