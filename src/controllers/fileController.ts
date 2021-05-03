import { Request, Response } from 'express';

class FileController {
    public upload = (req: Request, res: Response) => {
        if (req.file) {
            return res.status(200).json({
                message: 'File uploaded!',
                file: `public/uploads/${req.file.filename}`
            });
        }
        return res
            .status(400)
            .json({ message: 'Error: No file selected!', success: false });
    };
}

export const fileController = new FileController();
