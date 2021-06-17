import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import handleError from '../utils/handleError';
import mongoose from 'mongoose';

class NotificationController {
    public getAllByUserId = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const user_id = req.query.user_id as string;
        try {
            const notifications = await Notification.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'creator_id',
                        foreignField: '_id',
                        as: 'user_info'
                    }
                },
                {
                    $unwind: {
                        path: '$user_info',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ])
                .match({
                    recipient_id: mongoose.Types.ObjectId(user_id)
                })
                .project({
                    'user_info.role': 0,
                    'user_info.password': 0,
                    'user_info.created_at': 0,
                    'user_info.updated_at': 0
                })
                .sort({ created_at: -1 })
                .limit(limit)
                .skip(limit * page)
                .exec();
            const totalNotification = await Notification.find({
                recipient_id: user_id
            });
            const total_record = totalNotification.length;
            return res.status(200).json({
                data: notifications,
                success: true,
                meta: {
                    page_index: page,
                    page_size: limit,
                    total_record,
                    total_page: Math.ceil(total_record / limit)
                }
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get notifications by user id.');
        }
    };

    public create = async (req: Request, res: Response) => {
        const { content, url, recipient_id } = req.body;
        const newNotification = {
            content,
            url,
            creator_id: req.user.id,
            recipient_id
        };
        try {
            const result = await Notification.create(newNotification);
            return res.status(200).json({ data: result, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create notification.');
        }
    };

    public delete = async (req: Request, res: Response) => {
        const { notification_id } = req.params;
        try {
            const notification: any = await Notification.findById(
                notification_id
            );
            if (notification) {
                if (notification.recipient_id.equals(req.user.id)) {
                    const result = await Notification.findByIdAndDelete(
                        notification_id
                    );
                    return res
                        .status(200)
                        .json({ data: result, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to delete notification.',
                    success: false
                });
            }
        } catch (e) {
            return handleError(res, e, 'Cannot delete notification.');
        }
    };
}

export const notificationController = new NotificationController();
