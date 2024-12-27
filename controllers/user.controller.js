const User = require("../models/users.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        };
        const availableUser = await User.findOne({email});
        if (availableUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });
        await user.save();
        return res.status(201).json({
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        console.error("Error register user:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error",
        });
    };
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        };
        const user = await User.findOne({email});
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({
                id: user._id,
            }, process.env.ACCESS_TOKEN, {expiresIn: "1d"});
            user.password = undefined;
            res.status(200).json({
                message: "User logged in successfully",
                data: {user, token},
            });
        } else {
            return res.status(401).json({
                messaeg: "Invalid Email or Password",
            });
        };
    } catch (error) {
        console.error("Error login user:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error",
        });
    };
};

module.exports = {register, login};