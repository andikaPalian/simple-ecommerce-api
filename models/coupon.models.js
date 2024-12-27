const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    validFrom: {
        type: Date,
    },
    validUntil: {
        type: Date,
    },
    minimumPurchase: {
        type: Number,
    },
    usageLimit: {
        type: Number,
    },
    usedCount: {
        type: Number,
        default: 0,
    }
})