import { Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';

class UserController {
    public getCurrent = async (req: Request, res: Response) => {
        try {
            res.status(200).json({
                id: req.user.id,
                name: req.user.name,
                email: req.user.email
            });
        } catch (e) {
            console.log(e);
            return errorHandler(res, e, 'Cannot get all user.');
        }
    };
}

export const userController = new UserController();
