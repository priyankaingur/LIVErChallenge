const express = require("express");
require("express-async-errors");
const app = express();

const cors = require("cors");
const {unknownEndpoint, errorHandler} = require("./src/utils/middleware");
// const profitRouter = require("./controller/profits")
// const expenseRouter = require("./controller/expenses")
// const incomeRouter = require("./controller/incomes")
// const cakeRouter = require("./controller/cakes")
// const profileRouter = require("./controller/profiles")


// const middleware = require("./utils/middleware");

// const mongoose = require('mongoose').set("strictQuery", true)


// mongoose
//     .connect(config.MONGODB_URI)
//     .then(() => console.log("connected"))

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
// app.use("/api/profits", profitRouter);
// app.use("/api/expenses", expenseRouter);
// app.use("/api/incomes", incomeRouter);
// app.use("/api/cakes", cakeRouter);
// app.use("/api/profiles", profileRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app