import express from 'express';
import passport from 'passport';
import { fileController } from '../controllers/fileController';
import uploadFile from '../utils/uploadFile';

const router = express.Router();
router.post(
    '/upload-single',
    [
        passport.authenticate('jwt', { session: false }),
        uploadFile.upload.single('image'),
        uploadFile.resizeSingle
    ],
    fileController.uploadSingle
);

router.post(
    '/upload-multiple',
    [
        passport.authenticate('jwt', { session: false }),
        uploadFile.uploadImages,
        uploadFile.resizeImages
    ],
    fileController.uploadMultiple
);

export default router;
