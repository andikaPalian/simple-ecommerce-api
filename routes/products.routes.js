const express = require("express");
const auth = require("../middleware/auth");
const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/product.controller");
const router = express.Router();

router.post("/create-product", auth, createProduct);
router.get("/get-product", getProducts);
router.put("/update-product/:id", auth, updateProduct);
router.delete("/delete-product/:id", auth, deleteProduct);

module.exports = router;