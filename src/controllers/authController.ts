import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Model
import {User} from '../models/User';

class AuthController {
    public register = async (req: Request, res: Response) => {
        try {
            const { name, email, password, role } = req.body;
            let user: any = await User.findOne({ email });
            if (user)
                return res.status(400).json({ msg: 'User already exists' });

            // Create salt & hash
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = {
                name,
                email,
                password: hashedPassword,
                role
            };

            await User.create(newUser);
            return res.status(200).json(newUser);
        } catch (err) {
            console.log(err);
        }
    };

    public login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            let user: any = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: 'User not found' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const payload = { id: user.id, name: user.name, email: user.email };
                // Generate token
                const tokenSign = jwt.sign(
                    payload,
                    process.env.SECRET_OR_KEY,
                    { expiresIn: 3600 }
                );

                return res.status(200).json({
                    token: 'Bearer ' + tokenSign,
                    success: true
                });
            } 
            return res.status(400).json({ msg: 'Invalid email or password'});
        } catch (err) {
            console.log(err);
        }
    };
}

export const authController = new AuthController();
