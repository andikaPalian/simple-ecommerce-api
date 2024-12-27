const Order = require("../models/order.models");
const Product = require("../models/products.models");
const Coupon = require("../models/coupon.models");
const Cart = require("../models/cart.models");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {addressId, paymentMethod, couponCode} = req.body;
        const cart = await Cart.findOne({user: req.user._id}).populate("items.product");
        if (!cart || cart.items.length === 0) {
            res.json({
                message: "Cart is empty"
            });
        };
        // validasi ketersediaan produk/stok
        for (let item of cart.items) {
            const product = item.product;
            if (product.stock < item.quantity) {
                res.json({
                    message: `Insufficient stock for ${product.name}`,
                });
            };
        };
        // Apply coupon if provided
        let discount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode,
                validUntil: {$gte: new Date()},
                usedCount: {$lt: mongoose.get("UsageLimit")},
            });
            if (coupon) {
                discount = coupon.discountType === "percentage" ? (cart.total * coupon.amount / 100) : coupon.amount;
                coupon.usedCount += 1;
                await coupon.save({session});
            };
        };
        // Create order
        const order = new Order({
            user: req.user._id,
            items: cart.items,
            total: cart.total - discount,
            shippingAddress: await Address.findById(addressId),
            discount: {
                code: couponCode,
                amount: discount,
            },
        });
        // Update product stock
        for (let item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                {$inc: {stock: -item.quantity}},
                {session},
            );
        };
        // Clear cart
        await Cart.findByIdAndDelete(cart._id, {session});
        
        await order.save({session});
        await session.commitTransaction();
        // Send order confirmation email
        await sendOrderConfirmationEmail(req.user.email, order);
        res.status(201).json(order);
    } catch (error) {
        await session.abortTransaction();
        console.error("Error create order:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error",
        });
    } finally {
        session.endSession();
    };
};

module.exports = {createOrder}