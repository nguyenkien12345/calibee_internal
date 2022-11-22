//import library
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const createError = require('http-errors');
const path = require('path');

//import router
const customerRoute = require('./src/routes/customer/CustomerRoute');
const workerRoute = require('./src/routes/worker/WorkerRoute');
const bookingRoute = require('./src/routes/booking/BookingRoute');

dotenv.config();

const app = express();

//middleware
app.use(express.json({}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// router
app.use('/v1/internal/customers', customerRoute);
app.use('/v1/internal/workers', workerRoute);
app.use('/v1/internal/bookings', bookingRoute);

app.use((err, req, res, next) => {
    return res.status(500).json({
        status: err.status,
        message: err.message,
    });
});

app.use((req, res, next) => {
    next(createError.NotFound('This route dose not exists'));
});

const PORT = process.env.PORT;
app.listen(PORT, async (req, res, next) => {
    console.log(`Server is listening at PORT ${PORT}`);
});
