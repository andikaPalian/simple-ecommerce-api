const express = require("express");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const db = require("./config/db");
const { Logger } = require("winston");

const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(compression());
app.use(morgan("combined", {stream: Logger.stream}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
db();

app.use("/users", require("./routes/user.routes"));
app.use("/products", require("./routes/products.routes"));
app.use("/cart", require("./routes/cart.routes"));
app.use("/payment", require("./routes/payment.routes"));
app.use("/order", require("./routes/order.routes"));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});