import express from 'express';
import passport from 'passport';
import { userController } from '../controllers/userController';
import uploadFile from '../utils/uploadFile';

const router = express.Router();
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    userController.getCurrent
);
router.get('/search', userController.search);
router.put(
    '/change-info',
    [
        passport.authenticate('jwt', { session: false }),
        uploadFile.upload.single('avatar'),
        uploadFile.resizeSingle
    ],
    userController.changeInfo
);
router.delete(
    '',
    passport.authenticate('jwt', { session: false }),
    userController.delete
);

export default router;
