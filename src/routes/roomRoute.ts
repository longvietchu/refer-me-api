import express from 'express';
import passport from 'passport';
import { roomController } from '../controllers/roomController';

const router = express.Router();
router.get('/conversations', roomController.getRooms);
// router.get('/:room_id', roomController.getOneById);
router.post(
    '',
    passport.authenticate('jwt', { session: false }),
    roomController.create
);
// router.put(
//     '/:room_id',
//     passport.authenticate('jwt', { session: false }),
//     roomController.update
// );
router.delete(
    '/:room_id',
    passport.authenticate('jwt', { session: false }),
    roomController.delete
);
// Message
router.get('/messages', roomController.getMessages);
router.post(
    '/new-meesage',
    passport.authenticate('jwt', { session: false }),
    roomController.createMessage
);
router.put(
    '/message/:message_id',
    passport.authenticate('jwt', { session: false }),
    roomController.updateMessage
);
export default router;
