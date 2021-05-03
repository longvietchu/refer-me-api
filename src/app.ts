'use strict';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import passport from 'passport';
import passportService from './config/passport';

if (!process.env.ENV) {
    try {
        dotenv.config();
    } catch (e) {
        console.log('No loading env vars', e);
    }
}
const app = express();
const port = process.env.PORT || 5000;

// Database connection
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('Connect to MongoDB successful'))
    .catch((error) => console.log(error));

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

// Passport Config
passportService(passport);

// Declaration Merging
import { IUser } from './models/User';
declare global {
    namespace Express {
        interface User extends IUser {}
    }
}

// Routes
import api from './routes/index';
app.get('/', (req: Request, res: Response) => {
    res.send(
        'Hello I am Refer Me API. I am small and adorable so please do not DDOS me!!!'
    );
});
app.use('/v1', api);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
