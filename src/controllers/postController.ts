import { Request, Response } from 'express';
import { Connection } from '../models/Connection';
import { Post } from '../models/Post';
import handleError from '../utils/handleError';
import uploadFile from '../utils/uploadFile';

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
            // console.log(friendIds);
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
    getOne = async (req: Request, res: Response) => {
        const { post_id } = req.params;
        try {
            const post = await Post.findById(post_id).exec();
            if (post) {
                return res.status(200).json({
                    data: post,
                    success: true
                });
            }
            return res.status(404).json({
                message: 'Post does not exist.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get post.');
        }
    };
    create = async (req: Request, res: Response) => {
        const { description } = req.body;
        const images = uploadFile.getResult(req, res);
        const newPost = {
            description,
            post_image: images,
            user_id: req.user.id
        };
        try {
            await Post.create(newPost);
            return res.status(200).json({ data: newPost, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create post.');
        }
    };
    update = async (req: Request, res: Response) => {
        const { description } = req.body;
        const { post_id } = req.params;
        const updatePost = {
            description
        };
        try {
            const post: any = await Post.findById(post_id);
            if (post) {
                if (post.user_id.equals(req.user.id)) {
                    await Post.updateOne(
                        { _id: post_id },
                        { $set: updatePost },
                        { omitUndefined: true }
                    );
                    return res
                        .status(200)
                        .json({ data: updatePost, success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to update post',
                    success: false
                });
            }
            return res.status(404).json({
                message: 'Post not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot update post.');
        }
    };
    delete = async (req: Request, res: Response) => {
        const { post_id } = req.params;
        try {
            const post: any = await Post.findById(post_id);
            if (post) {
                if (post.user_id.equals(req.user.id)) {
                    await Post.deleteOne({ _id: post_id });
                    return res.status(200).json({ success: true });
                }
                return res.status(401).json({
                    message: 'Unauthorized to delete post.',
                    success: false
                });
            }
            return res.status(400).json({
                message: 'Post not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot delete post.');
        }
    };
}

export const postController = new PostController();
