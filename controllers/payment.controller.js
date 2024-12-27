const Order = require("../models/order.models");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const {amount} = req.body;
        if (!amount) {
            return res.status(400).json({
                message: "Amount is required"
            });
        };
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: "usd",
            metadata: {
                user: req.user._id,
            },
        });
        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error create payment intent:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error",
        });
    };
};

module.exports = {createPaymentIntent};