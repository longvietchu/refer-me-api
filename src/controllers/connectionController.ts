import { Request, Response } from 'express';
import { Connection } from '../models/Connection';
import handleError from '../utils/handleError';
import mongoose from 'mongoose';

class ConnectionController {
    public create = async (req: Request, res: Response) => {
        const { receiver_id, greeting } = req.body;
        const newConnection = {
            _id: `${req.user.id}.${receiver_id}`,
            receiver_id,
            sender_id: req.user.id,
            greeting
        };
        try {
            await Connection.create(newConnection);
            return res.status(200).json({ data: newConnection, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create connection.');
        }
    };

    public update = async (req: Request, res: Response) => {
        const { connection_id } = req.params;
        try {
            const connection: any = await Connection.findById(connection_id);
            if (connection) {
                if (connection.receiver_id.equals(req.user.id)) {
                    await Connection.updateOne(
                        { _id: connection_id },
                        { $set: { is_connected: true } },
                        { omitUndefined: true }
                    );
                    return res.status(200).json({
                        data: { connection_id, is_connected: true },
                        success: true
                    });
                }
                return res.status(401).json({
                    message: 'Unauthorized to update connection',
                    success: false
                });
            }
            return res.status(404).json({
                message: 'Connection not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot update connection.');
        }
    };

    public getOne = async (req: Request, res: Response) => {
        const { connection_id } = req.params;
        try {
            const connection = await Connection.findById(connection_id);
            if (connection) {
                return res.status(200).json({
                    data: connection,
                    success: true
                });
            }
            return res.status(400).json({
                message: 'Connection does not exist.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get Connection.');
        }
    };

    public getAll = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const userId = req.user.id;
        try {
            const connections = await Connection.find({
                _id: { $regex: new RegExp(userId), $options: 'ix' },
                is_connected: true
            })
                .sort({
                    created_at: 'desc'
                })
                .limit(limit)
                .skip(limit * page)
                .exec();
            const total_record = connections.length;
            if (connections) {
                res.status(200).json({
                    data: connections,
                    success: true,
                    meta: {
                        page_index: page,
                        page_size: limit,
                        total_record,
                        total_page: Math.ceil(total_record / limit)
                    }
                });
            }
        } catch (e) {
            return handleError(res, e, 'Cannot get connections.');
        }
    };

    public delete = async (req: Request, res: Response) => {
        const { connection_id } = req.params;
        try {
            await Connection.findByIdAndDelete(connection_id);
            return res.status(200).json({ success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot delete connection.');
        }
    };

    public getInvitation = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const userId = req.user.id;
        try {
            const invitations = await Connection.aggregate([
                {
                    $match: {
                        receiver_id: mongoose.Types.ObjectId(userId),
                        is_connected: false
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'sender_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        'user._id': 1,
                        'user.name': 1,
                        'user.email': 1,
                        'user.avatar': 1
                    }
                }
            ])
                .sort({ created_at: 'desc' })
                .limit(limit)
                .skip(limit * page)
                .exec();
            const total_record = invitations.length;
            res.status(200).json({
                data: invitations,
                success: true,
                meta: {
                    page_index: page,
                    page_size: limit,
                    total_record,
                    total_page: Math.ceil(total_record / limit)
                }
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get invitation.');
        }
    };
}

export const connectionController = new ConnectionController();