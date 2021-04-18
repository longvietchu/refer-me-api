import express from 'express';

// Controllers
import { authController } from '../controllers/authController';

// Middlewares
// import validations from '../../middlewares/validations.middleware';

const router = express.Router();
/**
 * @route   POST api/users
 * @desc    Register user
 * @access  Public
 */
router.post('/register', authController.register);

router.post('/login', authController.login);

export default router;
