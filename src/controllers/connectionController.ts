import { Request, Response } from 'express';
import { Connection } from '../models/Connection';
import handleError from '../utils/handleError';
import mongoose from 'mongoose';
import { User } from '../models/User';

class ConnectionController {
    public create = async (req: Request, res: Response) => {
        const { receiver_id, greeting } = req.body;
        const newConnection = {
            people: [req.user.id, receiver_id],
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
            let connections = await Connection.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'people',
                        foreignField: '_id',
                        as: 'people_info'
                    }
                }
            ])
                .match({
                    people: {
                        $all: [
                            {
                                $elemMatch: {
                                    $eq: mongoose.Types.ObjectId(userId)
                                }
                            }
                        ]
                    },
                    is_connected: true
                })
                .project({
                    'people_info.role': 0,
                    'people_info.password': 0,
                    'people_info.created_at': 0,
                    'people_info.updated_at': 0
                })
                .sort({ created_at: 'desc' })
                .limit(limit)
                .skip(limit * page)
                .exec();
            connections.map((item: any) => {
                item.people_info = item.people_info.filter(
                    (info: any) =>
                        !mongoose.Types.ObjectId(info._id).equals(userId)
                );
            });
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
                        as: 'user_info'
                    }
                },
                {
                    $unwind: {
                        path: '$user_info',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        'user_info.role': 0,
                        'user_info.password': 0,
                        'user_info.created_at': 0,
                        'user_info.updated_at': 0
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

    public getRecommend = async (req: Request, res: Response) => {
        const userId = req.user.id;
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        try {
            let userRecommend = await User.find({
                _id: { $ne: userId }
            })
                .select('-role -password')
                .limit(limit)
                .skip(limit * page)
                .exec();

            let myConnections = await Connection.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'people',
                        foreignField: '_id',
                        as: 'people_info'
                    }
                }
            ])
                .match({
                    people: {
                        $all: [
                            {
                                $elemMatch: {
                                    $eq: mongoose.Types.ObjectId(userId)
                                }
                            }
                        ]
                    }
                })
                .project({
                    'people_info.role': 0,
                    'people_info.password': 0,
                    'people_info.created_at': 0,
                    'people_info.updated_at': 0
                })
                .exec();
            // filter current user by _id
            myConnections.map((item: any) => {
                item.people_info = item.people_info.filter(
                    (info: any) =>
                        !mongoose.Types.ObjectId(info._id).equals(userId)
                );
            });

            // get users do not appear in current user's connection
            for (let i = 0; i < userRecommend.length; i++) {
                // console.log('current', userRecommend[i]._id);
                for (let j = 0; j < myConnections.length; j++) {
                    if (
                        mongoose.Types.ObjectId(
                            myConnections[j].people_info[0]._id
                        ).equals(userRecommend[i]._id)
                    ) {
                        // console.log('user in connection', userRecommend[i]._id);
                        userRecommend = userRecommend.filter(
                            (user: any) => user._id !== userRecommend[i]._id
                        );
                        continue;
                    }
                }
            }
            const total_record = userRecommend.length;
            return res.status(200).json({
                data: userRecommend,
                success: true,
                meta: {
                    page_index: page,
                    page_size: limit,
                    total_record,
                    total_page: Math.ceil(total_record / limit)
                }
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get connection recommend.');
        }
    };

    public inConnection = async (req: Request, res: Response) => {
        const currentUserId = req.user.id;
        const queryUserId = req.query.user_id as string;
        try {
            if (currentUserId === queryUserId) {
                return res.status(200).json({
                    connection: { object: 'me' },
                    in_connection: true
                });
            }
            const connection = await Connection.findOne().or([
                { people: [currentUserId, queryUserId] },
                { people: [queryUserId, currentUserId] }
            ]);
            if (connection) {
                return res.status(200).json({
                    connection,
                    in_connection: true
                });
            }
            return res.status(200).json({
                connection,
                in_connection: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get is-connected.');
        }
    };
}

export const connectionController = new ConnectionController();
