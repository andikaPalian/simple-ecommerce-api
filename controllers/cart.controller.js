const Cart = require("../models/cart.models");
const Product = require("../models/products.models");
const mongoose = require("mongoose");

const addToCart = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {productId, quantity} = req.body;
        // Cek stock produk
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        };
        if (product.stock < quantity) {
            res.json({
                message: "Insufficient stock",
            });
        };
        // update cart with stock validation
        let cart = await Cart.findOne({user: req.user._id})
        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [{
                    product: productId,
                    quantity,
                }]
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            // Jika barang sudah ada di keranjang tambahkan jumlahnya
            if (itemIndex > -1) {
                const newQuantity = cart.items[itemIndex].quantity + quantity;
                if (newQuantity < 0) {
                    res.json({
                        message: "Request quantity exceeds the available stock",
                    })
                }
                cart.items[itemIndex].quantity = quantity;
            } else {
                // Jika belum ada tambahkan barang ke keranjang
                cart.items.push({
                    product: productId,
                    quantity,
                });
            };
        };
        // Calculate total with shipping and discount

        await cart.populate("items.product");
        cart.total = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
        await cart.save({session});
        await session.commitTransaction();
        res.status(201).json({
            message: "Product added to cart",
            data: cart,
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error add to cart:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error",
        });
    } finally {
        session.endSession();
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({user: req.use._id}).populate("items.product");
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found,"
            });
        };
        res.status(200).json({
            message: "Cart retrieved successfully",
            data: cart,
        });
    } catch (error) {
        console.error("Error get cart:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message || "An unexpected error",
        });
    };
};

const updateCart = async (req, res) => {
    try {
        const {quantity} = req.body;
        const {itemId} = req.params;
        if (quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0",
            });
        };
        const cart = await Cart.findOne({user: req.user._id});
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        };
        const itemIndex = cart.items.findIndex(item => item.product.toString() === itemId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            await cart.populate("items.product");
            res.status(200).json({
                message: "Cart updated successfully",
                data: cart,
            });
        } else {
            res.status(404).json({
                message: "Product not found in cart",
            });
        };
    } catch (error) {
        console.error("Error update cart:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error",
        });
    };
};

const removeFromCart = async (req, res) => {
    try {
        const {itemId} = req.params;
        const cart = await Cart.findOne({user: req.user._id});
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        };
        const itemIndex = cart.items.findIndex(item => item.product.toString() === itemId);
        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            await cart.save();
            await cart.populate("items.product");
            res.status(200).json({
                message: "Product removed from cart",
                data: cart,
            });
        } else {
            res.status(404).json({
                message: "Product not found in cart",
            });
        };
    } catch (error) {
        console.error("Error remove from cart:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error",
        });
    };
};

module.exports = {addToCart, getCart, updateCart, removeFromCart};