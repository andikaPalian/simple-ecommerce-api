const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");

const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
db();

app.use("/users", require("./routes/user.routes"));
app.use("/products", require("./routes/products.routes"));
app.use("/cart", require("./routes/cart.routes"));
app.use("/payment", require("./routes/payment.routes"));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});