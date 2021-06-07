import express from 'express';
import passport from 'passport';
import { postController } from '../controllers/postController';

const router = express.Router();

router.get(
    '/feed',
    passport.authenticate('jwt', { session: false }),
    postController.getAll
);
router.get('/detail/:post_id', postController.getOne);
router.post(
    '',
    passport.authenticate('jwt', { session: false }),
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
router.get('/reaction', postController.getReactions);
router.post(
    '/reaction/like',
    passport.authenticate('jwt', { session: false }),
    postController.createReaction
);

// Comment
router.get('/comment', postController.getCommentsOfPost);
router.post(
    '/comment',
    passport.authenticate('jwt', { session: false }),
    postController.createComment
);

export default router;
