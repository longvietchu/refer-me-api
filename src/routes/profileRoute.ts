import express from 'express';
import passport from 'passport';
import { profileController } from '../controllers/profileController';
import uploadFile from '../utils/uploadFile';

const router = express.Router();
router.get('/user/:user_id', profileController.getOne);
router.post(
    '',
    [
        passport.authenticate('jwt', { session: false }),
        uploadFile.upload.single('background_image'),
        uploadFile.resizeSingle
    ],
    profileController.create
);
router.post(
    '/background-image',
    [
        passport.authenticate('jwt', { session: false }),
        uploadFile.upload.single('background_image'),
        uploadFile.resizeSingle
    ],
    profileController.updateBackgroundImage
);
router.delete(
    '',
    passport.authenticate('jwt', { session: false }),
    profileController.delete
);

export default router;
