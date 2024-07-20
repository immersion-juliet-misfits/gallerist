const express = require('express');
const path = require('path');
// const ensureLogIn = require('connect-ensure-login').ensureLoggedIn();
const session = require('express-session');
const logger = require('morgan');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const { authRouter } = require('./routes/auth');
const { apiRouter } = require('./routes/api');
const { dbRouter } = require('./routes/database');
require('dotenv').config();

const { EXPRESS_SECRET } = process.env;

// what routes will we need client side to access db
// PUT req to udpate art documents with secondary get request
// Req for adding art to users gallery POST

const app = express();

// views
app.set('views', path.resolve(__dirname, '../client/views'));
app.set('view engine', 'ejs');

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.use(session({
  secret: EXPRESS_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URI,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native',
  }),
}));
app.use(passport.authenticate('session'));

// Authentication Routes
app.use('/', authRouter);

// Api Routes
app.use('/', apiRouter);

// DB Routes
app.use('/', dbRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(3000, () => {
  console.log('gallerist server listening on port 3000. http://localhost:3000');
});
