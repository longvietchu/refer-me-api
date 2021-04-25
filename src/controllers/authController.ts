import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Model
import {IUser, User} from '../models/User';
import errorHandler from '../utils/errorHandler';

class AuthController {
    public register = async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, role } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user)
                return res.status(400).json({ msg: 'User already exists' });

            // Create salt & hash
            const salt: string = await bcrypt.genSalt(10);
            const hashedPassword: string = await bcrypt.hash(password, salt);

            const newUser = {
                name,
                email,
                password: hashedPassword,
                role
            };

            await User.create(newUser);
            return res.status(200).json({user: {name, email, role}});
        } catch (e) {
            console.log(e);
            return errorHandler(res, e, 'Cannot register new user.');
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
        } catch (e) {
            console.log(e);
            return errorHandler(res, e, 'Cannot login user.');
        }

    };
}

export const authController = new AuthController();
