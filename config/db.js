const mongoose = require("mongoose");

const db = async () => {
    try {
        const connect = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`Database connected ${connect.connection.host} ${connect.connection.name}`);
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    };
};

module.exports = db;