import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import handleError from '../utils/handleError';

class AuthController {
    public register = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, role, avatar } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user)
                return res
                    .status(400)
                    .json({ message: 'User already exists', success: false });

            // Create salt & hash
            const salt: string = await bcrypt.genSalt(10);
            const hashedPassword: string = await bcrypt.hash(password, salt);

            const newUser = {
                name,
                email,
                password: hashedPassword,
                avatar,
                role
            };

            const result: any = await User.create(newUser);

            const payload = {
                id: result.id,
                name: result.name,
                email: result.email
            };
            // Generate token
            const tokenSign = jwt.sign(payload, process.env.SECRET_OR_KEY, {
                expiresIn: parseInt(process.env.EXPIRE_TIME)
            });
            return res.status(200).json({
                user: { name, email, avatar, role },
                token: 'Bearer ' + tokenSign,
                success: true
            });
        } catch (e) {
            return handleError(res, e, 'Cannot register new user.');
        }
    };

    public login = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        try {
            let user: any = await User.findOne({ email });
            if (!user)
                return res.status(404).json({ message: 'User not found' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };
                // Generate token
                const tokenSign = jwt.sign(payload, process.env.SECRET_OR_KEY, {
                    expiresIn: parseInt(process.env.EXPIRE_TIME)
                });

                return res.status(200).json({
                    token: 'Bearer ' + tokenSign,
                    success: true
                });
            }
            return res
                .status(400)
                .json({ message: 'Invalid email or password', success: false });
        } catch (e) {
            return handleError(res, e, 'Cannot login user.');
        }
    };
}

export const authController = new AuthController();
