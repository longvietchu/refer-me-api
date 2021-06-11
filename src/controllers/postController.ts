import { Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { Connection } from '../models/Connection';
import { Post } from '../models/Post';
import { Reaction } from '../models/Reaction';
import handleError from '../utils/handleError';
import mongoose from 'mongoose';

class PostController {
    paginate = (array: any, page_size: number, page_number: number) => {
        return array.slice(page_number * page_size, page_number * page_size);
    };
    getAll = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const userId = req.user.id;
        try {
            const connections = await Connection.aggregate()
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
                .exec();
            let friendIds = connections.map((item: any) => {
                let friendId = item.people.filter((id: any) => id !== userId);
                return friendId[0];
            });
            // console.log(friendIds);

            let posts = await Post.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
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
                    $lookup: {
                        from: 'reactions',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'reactions'
                    }
                },
                {
                    $unwind: {
                        path: '$reactions',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ])
                .match({
                    user_id: { $in: friendIds }
                })
                .project({
                    'user_info.role': 0,
                    'user_info.password': 0,
                    'user_info.created_at': 0,
                    'user_info.updated_at': 0
                })
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
        const { description, post_image } = req.body;
        const newPost = {
            description,
            post_image,
            user_id: req.user.id
        };
        try {
            const result = await Post.create(newPost);
            return res.status(200).json({ data: result, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create post.');
        }
    };
    update = async (req: Request, res: Response) => {
        const { description, post_image } = req.body;
        const { post_id } = req.params;
        const updatePost = {
            description,
            post_image
        };
        try {
            const post: any = await Post.findById(post_id);
            if (post) {
                if (post.user_id.equals(req.user.id)) {
                    const result = await Post.findOneAndUpdate(
                        { _id: post_id },
                        { $set: updatePost },
                        { omitUndefined: true, new: true }
                    );
                    return res
                        .status(200)
                        .json({ data: result, success: true });
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
                    const result = await Post.findByIdAndDelete(post_id);
                    return res
                        .status(200)
                        .json({ data: result, success: true });
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

    public getReactions = async (req: Request, res: Response) => {
        const post_id = req.query.post_id as string;
        try {
            const reactions = await Reaction.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
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
                    post_id: mongoose.Types.ObjectId(post_id)
                })
                .project({
                    'user_info.role': 0,
                    'user_info.password': 0,
                    'user_info.created_at': 0,
                    'user_info.updated_at': 0
                })
                .sort({
                    created_at: 'desc'
                })
                .exec();
            return res.status(200).json({
                data: reactions,
                success: true
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get reactions.');
        }
    };

    public createReaction = async (req: Request, res: Response) => {
        const { post_id } = req.query;
        try {
            const reaction = await Reaction.findOne({
                post_id,
                user_id: req.user.id
            });
            if (reaction) {
                const result = await Reaction.findByIdAndDelete(reaction.id);
                return res.status(200).json({
                    data: result,
                    messsage: 'Reaction deleted.',
                    success: true
                });
            }
            const newReaction = {
                post_id,
                user_id: req.user.id
            };
            const result = await Reaction.create(newReaction);
            return res.status(200).json({ data: result, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create reaction.');
        }
    };

    public getCommentsOfPost = async (req: Request, res: Response) => {
        const post_id = req.query.post_id as string;
        try {
            const comments = await Comment.aggregate([
                {
                    $match: {
                        post_id: mongoose.Types.ObjectId(post_id)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
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
                .exec();
            return res.status(200).json({
                data: comments,
                success: true
            });
        } catch (e) {
            return handleError(res, e, 'Cannot get comment.');
        }
    };

    public createComment = async (req: Request, res: Response) => {
        const { post_id } = req.query;
        const { content } = req.body;
        try {
            const newComment = {
                content,
                post_id,
                user_id: req.user.id
            };
            const result = await Comment.create(newComment);
            return res.status(200).json({ data: result, success: true });
        } catch (e) {
            return handleError(res, e, 'Cannot create comment.');
        }
    };
}

export const postController = new PostController();
