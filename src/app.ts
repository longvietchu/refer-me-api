'use strict';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import passport from 'passport';
import passportService from './config/passport';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Database connection
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connect to MongoDB successful'))
    .catch((error) => console.log(error));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
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
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import profileRoute from './routes/profileRoute';

app.use('/v1/user', userRoute);
app.use('/v1/auth', authRoute);
app.use('/v1/profile', profileRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
