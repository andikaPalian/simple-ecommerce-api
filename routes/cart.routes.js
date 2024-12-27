const express = require("express");
const auth = require("../middleware/auth");
const { addToCart, getCart, updateCart, removeFromCart } = require("../controllers/cart.controller");
const router = express.Router();

router.post("/add-to-cart", auth, addToCart);
router.get("/get-cart", auth, getCart);
router.put("/update-cart/:itemId", auth, updateCart);
router.delete("/delete-cart/:itemId", auth, removeFromCart);

module.exports = router;