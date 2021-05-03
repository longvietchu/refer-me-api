import express from 'express';
import passport from 'passport';
import { fileController } from '../controllers/fileController';
import uploadFile from '../utils/uploadFile';

const router = express.Router();
router.post(
    '/upload',
    passport.authenticate('jwt', { session: false }),
    uploadFile.uploadImages,
    uploadFile.resizeImages,
    uploadFile.getResult
);

export default router;
