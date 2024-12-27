const jwt = require("jsonwebtoken");
const User = require("../models/users.models");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                message: "No authentication token, authorization denied",
            });
        };
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        };
        req.user = user;
        next();
    } catch (error) {
        console.error("Error authentication user:", error);
        return res.status(401).json({
            message: "Token is not valid"
        });
    };
};

module.exports = auth;