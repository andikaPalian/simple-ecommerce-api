const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    }],
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "processing", "delivered", "shipped", "cancelled"],
        default: "pending",
    },
    paymentIntent: {
        type: String,
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    trackingNumber: {
        type: String,
    },
    shippingCost: {
        type: Number,
    },
    discount: [{
        code: {
            type: String,
        },
        amount: {
            type: Number,
        }
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model("Order", orderSchema);