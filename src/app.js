/* eslint-disable */
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const { ExpressPeerServer } = require("peer");
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
//app.use(helmet());


app.use(express.json());


app.use(express.urlencoded({ extended: true }));


app.use(xss());
app.use(mongoSanitize());


app.use(compression());

app.use(cors());
app.options('*', cors());


app.use(passport.initialize());
passport.use('jwt', jwtStrategy);


if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}
/*
app.use("/admin",express.static(path.join(__dirname, "./../public/admin")));

app.use((req,res,next)=>{
    res.sendFile(__dirname, "./../public/admin/index.html")
});
*/

app.use(express.static(path.join(__dirname, "./../public/")));

app.get('/video-call', function (req, res) {
  res.render("index.ejs");
});

// v1 api routes
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
