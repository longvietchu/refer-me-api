import { check } from 'express-validator';

export const registerValidation = [
    check('name', 'Username must be at least 6 chars long').isLength({
        min: 6
    }),
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be at least 6 chars long').isLength({
        min: 6
    })
];

export const loginValidation = [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password is required').trim().not().isEmpty()
];
