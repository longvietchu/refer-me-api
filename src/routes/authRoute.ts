import express from 'express';
import { authController } from '../controllers/authController';
import { loginValidation, registerValidation } from '../utils/validations';

const router = express.Router();
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

export default router;
