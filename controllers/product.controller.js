const Product = require("../models/products.models");

const createProduct = async (req, res) => {
    try {
        const {name, description, price, stock, image} = req.body;
        if (!name || !description || !price || !stock) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        };
        const products = new Product({
            name,
            description,
            price,
            stock,
            image,
        });
        await products.save();
        res.status(201).json({
            message: "Product created successfully",
            data: products,
        });
    } catch (error) {
        console.error("Error create product:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error",
        });
    };
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error get products:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error",
        });
    };
};

const updateProduct = async (req, res) => {
    try {
        const products = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true},
        )
        if (!products) {
            return res.status(404).json({
                message: "Product Not Found",
            });
        };
        res.status(200).json({
            message: "Product updated successfully",
            data: products,
        })
    } catch (error) {
        console.error('Error update product:', error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error"
        });
    };
};

const deleteProduct = async (req, res) => {
    try {
        const products = await Product.findByIdAndDelete(req.params.id);
        if (!products) {
            return res.status(404).json({
                message: "Product Not Found",
            });
        };
        res.status(200).json({
            message: "Product deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "An unexpected error",
        });
    };
};

module.exports = {createProduct, getProducts, updateProduct, deleteProduct};