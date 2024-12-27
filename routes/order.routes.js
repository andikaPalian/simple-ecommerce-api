const express = require("express");
const auth = require("../middleware/auth");
const { createOrder } = require("../controllers/order.controller");
const router = express.Router();

router.post("/create-order", auth, createOrder);

module.exports = router;