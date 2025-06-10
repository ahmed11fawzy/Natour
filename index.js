const express = require("express");
const fs = require("fs");
const qs = require("qs");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const db = require("./Config/dbConfig");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");
const reviewRouter = require("./routes/reviewRoutes");
// const Tour = require("./Model/tourModel");

// ! get tours data from json and store it in a database .
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, "utf-8"));
// ! start express app & connect to db

const app = express();
const Port = process.env.PORT || 3000;
db.then(() => {
  console.log("DB connection successful!");
  app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
    /* Tour.create(tours, {
      validateBeforeSave: false,
    }); */
  });
}).catch((err) => {
  console.log("DB connection failed!");
});

// ! Middlewares

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const rateLimitter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

// ! Security meddilewares

app.use(helmet()); // * setting security headers
app.use("/api", rateLimitter); // * rate limiting
// * prevent http parameter pollution

// ! Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// ! Query Passer
app.set("query parser", "extended"); // TODO  to configure how query strings in incoming HTTP requests are parsed

// ! Routes

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// ! handling unhandled routes
const server = app.use((req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ! Global error handling middleware

app.use(globalErrorHandler);

// ! Unhandled Rejection and uncaught exception handling

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception! Shutting down...");
  console.log(err.name, err.message);
  /* server.close(() => {
    process.exit(1);
  }); */
});
