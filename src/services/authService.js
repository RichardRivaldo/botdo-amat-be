import { User } from '../models/User';

const jwt = require('jsonwebtoken');
const { promisify } = require('util');

export const signup = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) throw new Error('Please provide email or password');

        const user = await User.create({ username, password });

        res.status(200).json({
            status: 'Success',
            data: user,
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            data: err.message,
        });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // 1) Check if email and password provided
        if (!username || !password) throw new Error('Please provide email or password');

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ username });
        if (!user || !(await user.checkPassword(password, user.password)))
            throw new Error('Incorrect email or password');

        // 3) Finish
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES,
        });
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        res.cookie('jwt', token, cookieOptions);
        user.password = undefined;

        res.status(200).json({
            status: 'Success',
            data: { user, token },
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            data: err.message,
        });
    }
};

export const protect = async (req, res, next) => {
    const { authorization: auth } = req.headers;
    const token = auth && auth.startsWith('Bearer') ? auth.split(' ')[1] : null;

    try {
        // Check token
        if (!token) throw new Error('You are not logged in! Please log in to get access.');

        // Verify token
        const verify_token = promisify(jwt.verify);
        const { id } = await verify_token(token, process.env.JWT_SECRET_KEY);

        // Check user
        const user = await User.findById(id);
        if (!user) throw new Error('The user belonging to this token does no longer exist.');

        req.user = user;

        next();
    } catch (err) {
        res.status(401).json({
            status: 'failed',
            message: err.message,
        });
    }
};
