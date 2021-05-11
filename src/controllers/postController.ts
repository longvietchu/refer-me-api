import { Request, Response } from 'express';
import { Connection } from '../models/Connection';
import { Post } from '../models/Post';
import handleError from '../utils/handleError';

class PostController {
    getAll = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const userId = req.user.id;
        try {
            const connections = await Connection.find({
                _id: { $regex: new RegExp(userId), $options: 'ix' },
                is_connected: true
            });
            let friendIds = connections.map((item: any) => {
                let dotPattern = /\./;
                let friendId = item._id.replace(userId, '');
                friendId = friendId.replace(dotPattern, '');
                return friendId;
            });
            console.log(friendIds);
            const posts = await Post.find()
                .where('user_id')
                .in(friendIds)
                .sort({
                    created_at: 'desc'
                })
                .limit(limit)
                .skip(limit * page)
                .exec();
            const total_record = posts.length;
            res.status(200).json({
                data: posts,
                success: true,
                meta: {
                    page_index: page,
                    page_size: limit,
                    total_record,
                    total_page: Math.ceil(total_record / limit)
                }
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get all posts');
        }
    };
    getOne = async (req: Request, res: Response) => {};
    create = async (req: Request, res: Response) => {};
    update = async (req: Request, res: Response) => {};
    delete = async (req: Request, res: Response) => {};
}

export const postController = new PostController();
