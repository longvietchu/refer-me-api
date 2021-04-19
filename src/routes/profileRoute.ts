import express from 'express';
import { profileController } from '../controllers/profileController';

// Controllers

// Middlewares
// import validations from '../../middlewares/validations.middleware';

const router = express.Router();
router.post('/create-profile', profileController.create);

export default router;
