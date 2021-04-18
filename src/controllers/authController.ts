import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Model
import User from '../models/User';

class AuthController {
    public register = async (req: Request, res: Response) => {
        const { name, email, password, role } = req.body;
        try {
            let user: any = await User.findOne({ email });
            if (user)
                return res.status(400).json({ msg: 'User already exists' });

            // Create salt & hash
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser: any = await User.create({
                name,
                email,
                password: hashedPassword,
                role
            });

            // Generate token
            const tokenSign = jwt.sign(
                { email: newUser.email },
                process.env.SECRET_OR_KEY,
                { expiresIn: 3600 }
            );

            res.status(200).json({
                token: 'Bearer ' + tokenSign,
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    public login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            let user: any = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: 'User not found' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // Generate token
                const tokenSign = jwt.sign(
                    { email: user.email },
                    process.env.SECRET_OR_KEY,
                    { expiresIn: 3600 }
                );

                res.status(200).json({
                    token: 'Bearer ' + tokenSign,
                    success: true
                });
            } else {
                res.status(400).json({ msg: 'Invalid email or password'});
            }
        } catch (err) {
            console.log(err);
        }
    };
}

export const authController = new AuthController();
