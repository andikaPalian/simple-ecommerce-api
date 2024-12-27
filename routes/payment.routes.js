const express = require("express");
const auth = require("../middleware/auth");
const { createPaymentIntent } = require("../controllers/payment.controller");
const router = express.Router();

router.post("/create-payment-intent", auth, createPaymentIntent);

module.exports = router;