import express from 'express';
import passport from 'passport';
import { postController } from '../controllers/postController';
import uploadFile from '../utils/uploadFile';

const router = express.Router();

router.get(
    '/feed',
    passport.authenticate('jwt', { session: false }),
    postController.getAll
);
router.get('/detail/:post_id', postController.getOne);
router.post(
    '',
    [
        passport.authenticate('jwt', { session: false }),
        uploadFile.uploadImages,
        uploadFile.resizeImages
    ],
    postController.create
);
router.put(
    '/:post_id',
    passport.authenticate('jwt', { session: false }),
    postController.update
);
router.delete(
    '/:post_id',
    passport.authenticate('jwt', { session: false }),
    postController.delete
);

// Reaction
router.post(
    '/reaction/like',
    passport.authenticate('jwt', { session: false }),
    postController.createReaction
);

export default router;
