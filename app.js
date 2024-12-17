var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

// import mongoose
 const mongoose = require('mongoose');

// MongoDB connection string
const mongoDB = 'mongodb+srv://mernelotrisha:dit2004IoPJgK9n9@cluster0.kq8hk.mongodb.net/local_library?retryWrites=true&w=majority';

mongoose.connect(mongoDB);
/////

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const dev_db_url =
  'mongodb+srv://mernelotrisha:dit2004IoPJgK9n9@cluster0.kq8hk.mongodb.net/local_library?retryWrites=true&w=majority';
const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));


mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose has disconnected from MongoDB');
});

// import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoryRouter = require('./routes/category');
const cartRouter = require('./routes/cart');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    next();
});

app.get('/profile', (req, res, next) => {
    console.log('Profile route hit');
    try {
        console.log('Attempting to render profile');
        res.render('profile', {}, (err, html) => {
            if (err) {
                console.error('Profile render error:', err);
                next(err);
                return;
            }
            console.log('Profile rendered successfully');
            res.send(html);
        });
    } catch (err) {
        console.error('Profile route error:', err);
        next(err);
    }
});

// use routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/products/category', categoryRouter);
app.use('/cart', cartRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const express = require('express');
const app = express();
const path = require('path');

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Adjust the path as necessary

// Define the route for the profile page
app.get('/profile', (req, res) => {
   res.send('Profile Page');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Add this before your routes
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

module.exports = app;
