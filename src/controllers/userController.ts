import { Request, Response } from "express";

// Model
import User from '../models/User';

class UserController {
    public getAll = async (req: Request, res: Response) => {
        try {
            res.status(200).json({
                // @ts-ignore
                id: req.user.id,
                // @ts-ignore
                name: req.user.name,
                // @ts-ignore
                email: req.user.email
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export const userController = new UserController();