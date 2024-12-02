const asyncHandler = require('express-async-handler');
const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('All fields are mandotory');
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered"); 
    }
    //hasing password

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    if (user) {
        res.status(201).json({ _id: user.id, email: user.email })
    }
    else {
        res.status(400);
        throw new Error('User data is not valid');
    }
    res.json({ message: 'Register the user' });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error('Enter email and password');
    }
    else {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            console.log('reached login');
            const accesstoken = jwt.sign({
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "21m" }
            );
            console.log('successs');
            res.status(200).json({ accessToken:accesstoken });;

        }
        else{
            res.status(401);
            throw new Error("Email or Password is incorrect");
        }
    }

    res.json({ message: 'Login user' });
});

const current = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = { registerUser, loginUser, current };
