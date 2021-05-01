import { Response } from 'express';

export default (res: Response, e: any, message: string) => {
    let statusCode: number = e.code === 11000 ? 400 : 500;
    return res.status(statusCode).json({
        success: false,
        message,
        errors: [{ msg: e.message }]
    });
};
