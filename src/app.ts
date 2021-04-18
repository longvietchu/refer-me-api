import express, { Request, Response } from "express";
import dotenv from 'dotenv'
import mongoose from "mongoose";
import path from 'path';

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// Database connection
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connect to MongoDB successful'))
    .catch(error => console.log(error));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';

app.use('/v1/user', userRoute);
app.use('/v1/auth', authRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});