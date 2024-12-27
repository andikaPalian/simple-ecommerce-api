const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    country: {
        type: String,
    },
    isDefault: {
        type: Boolean,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Address", addressSchema);