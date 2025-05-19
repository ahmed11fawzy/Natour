const express= require('express');
const tourRouter = require('./routes/tourRoutes');
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

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRouter);

