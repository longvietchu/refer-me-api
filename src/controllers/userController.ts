import { Request, Response } from 'express';
import { User } from '../models/User';
import handleError from '../utils/handleError';
import bcrypt from 'bcryptjs';

class UserController {
    public getCurrent = async (req: Request, res: Response) => {
        try {
            res.status(200).json({
                data: {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    avatar: req.user.avatar
                }
            });
        } catch (e) {
            console.log(e);
            return handleError(res, e, 'Cannot get all user.');
        }
    };

    public changeInfo = async (req: Request, res: Response) => {
        const updateUser = {
            name: req.body.name,
            avatar: req.body.avatar,
            headline: req.body.headline
        };

        try {
            const user = await User.findOne({ _id: req.user.id });
            if (user) {
                await User.updateOne(
                    { _id: req.user.id },
                    { $set: updateUser },
                    { omitUndefined: true }
                );
                return res.status(200).json({
                    data: updateUser,
                    success: true
                });
            }
            return res.status(401).json({
                msg: 'Unauthorized to change info of user',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot change info of user.');
        }
    };

    public changePassword = async (req: Request, res: Response) => {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        try {
            let user: any = await User.findById(req.user.id);
            if (!user)
                return res.status(404).json({ message: 'User not found' });
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (isMatch) {
                if (newPassword === confirmPassword) {
                    const salt: string = await bcrypt.genSalt(10);
                    const hashedPassword: string = await bcrypt.hash(
                        newPassword,
                        salt
                    );
                    await User.updateOne(
                        { _id: req.user.id },
                        { $set: { password: hashedPassword } },
                        { omitUndefined: true }
                    );
                    return res.status(200).json({
                        message: 'Change password successful!',
                        success: true
                    });
                }
                return res.status(200).json({
                    message: 'New password and confirm password do not match!',
                    success: false
                });
            }
            return res.status(200).json({
                message: 'Old password is not correct!',
                success: false
            });
        } catch (e) {
            console.log(e);
            return handleError(res, e, 'Cannot change password.');
        }
    };

    public delete = async (req: Request, res: Response) => {
        try {
            const user = await User.findOne({ _id: req.user.id });
            if (user) {
                await User.deleteOne({ _id: req.user.id });
                return res.status(200).json({
                    success: true
                });
            }
            return res.status(401).json({
                msg: 'Unauthorized to delete user.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot delete user.');
        }
    };

    public search = async (req: Request, res: Response) => {
        const keyword = req.query.keyword as string;
        try {
            const users = await User.find({
                name: { $regex: new RegExp(keyword), $options: 'ix' }
            })
                .limit(10)
                .exec();
            if (users) {
                return res.status(200).json({ data: users, success: true });
            }
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        } catch (e) {
            return handleError(res, e, 'Cannot search users.');
        }
    };
}

export const userController = new UserController();
