import { Request, Response } from 'express';
import { Room } from '../models/Room';
import { User } from '../models/User';
import handleError from '../utils/handleError';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../models/Message';

class RoomController {
    public getRooms = async (req: Request, res: Response) => {
        const user_id = req.query.user_id as string;
        let rooms: any[] = [];
        try {
            rooms = await Room.find({
                _id: { $regex: new RegExp(user_id), $options: 'i' }
            }).exec();
            for (let i = 0; i < rooms.length; i++) {
                let partnerId = '';
                if (rooms[i].receiver_id.equals(user_id)) {
                    partnerId = rooms[i].creator_id;
                } else {
                    partnerId = rooms[i].receiver_id;
                }
                // console.log(partnerId);
                let user_info = await User.findById(partnerId)
                    .select('name avatar')
                    .exec();
                let findCondition = {
                    room_id: rooms[i]._id,
                    created_at: { $lte: Date.now() }
                };
                rooms[i].user_info = user_info;
                let message = await Message.find(findCondition)
                    .sort({ created_at: -1 })
                    .limit(2)
                    .exec();
                if (message.length > 0) {
                    rooms[i].lastest_message = message[0];
                }
            }
            return res.status(200).json({ data: rooms, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot get rooms by user id.');
        }
    };

    public create = async (req: Request, res: Response) => {
        const { user_id } = req.query;
        const newRoom = {
            _id: req.user.id + '.' + user_id,
            creator_id: req.user.id,
            receiver_id: user_id
        };
        try {
            const result = await Room.create(newRoom);
            return res.status(200).json({ data: result, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create room.');
        }
    };

    public delete = async (req: Request, res: Response) => {
        const { room_id } = req.params;
        try {
            const room: any = await Room.findById(room_id);
            if (room) {
                if (
                    room.creator_id.equals(req.user.id) ||
                    room.receiver_id.equals(req.user.id)
                ) {
                    const result = await Room.findByIdAndDelete(room_id);
                    return res
                        .status(200)
                        .json({ data: result, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to delete room.',
                    success: false
                });
            }
        } catch (e) {
            return handleError(res, e, 'Cannot delete room.');
        }
    };

    public getMessages = async (req: Request, res: Response) => {
        const room_id = req.query.room_id as string;
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        try {
            const messages = await Message.find({ room_id })
                .sort({ created_at: 'desc' })
                .limit(limit)
                .skip(limit * page)
                .exec();
            const total_record = await Message.countDocuments({
                room_id
            }).exec();
            return res.status(200).json({
                data: messages,
                meta: {
                    page_index: page,
                    page_size: limit,
                    total_record,
                    total_page: Math.ceil(total_record / limit)
                },
                success: true
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get messages.');
        }
    };
    public createMessage = async (req: Request, res: Response) => {
        const room_id = req.query.room_id as string;
        const { content } = req.body;
        try {
            let dotPattern = /\./;
            let to = room_id.replace(req.user.id, '');
            to = to.replace(dotPattern, '');
            const newMessage = {
                _id: uuidv4(),
                room_id,
                from: req.user.id,
                to,
                content: content.trim(),
                is_seen: false
            };
            const result = await Message.create(newMessage);
            return res.status(200).json({ data: result, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create message.');
        }
    };

    public updateMessage = async (req: Request, res: Response) => {
        const { message_id } = req.params;
        try {
            const message: any = await Message.findById(message_id);
            if (message) {
                if (message.to.equals(req.user.id)) {
                    const result = await Message.findOneAndUpdate(
                        { _id: message_id },
                        { $set: { is_seen: true } },
                        { omitUndefined: true, new: true }
                    );
                    return res
                        .status(200)
                        .json({ data: result, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to update message',
                    success: false
                });
            }
            return res.status(404).json({
                message: 'Message not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot update message.');
        }
    };
}

export const roomController = new RoomController();
