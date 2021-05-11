import express from 'express';
import { authController } from '../controllers/authController';
import uploadFile from '../utils/uploadFile';
import { loginValidation, registerValidation } from '../utils/validations';

const router = express.Router();
router.post(
    '/register',
    [uploadFile.upload.single('avatar'), uploadFile.resizeSingle],
    registerValidation,
    authController.register
);
router.post('/login', loginValidation, authController.login);

export default router;
