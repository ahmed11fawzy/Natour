const express= require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const appError =require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController');
const dotenv = require('dotenv').config();
const db = require('./Config/dbConfig');
const morgan = require('morgan');




// start express app & connect to db

const app = express();
const Port = process.env.PORT || 3000;
db.then(() => {
    console.log('DB connection successful!');
    app.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });

}).catch((err) => {
    console.log('DB connection failed!');
    console.log(err);
});


// Middleware
app.set('query parser', 'extended');
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handling unhandled routes
const server=app.use((req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// Global error handling middleware

app.use(globalErrorHandler);


// Unhandled Rejection and uncaught exception handling

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
    server.close(() => {
        process.exit(1);
    });
});