const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const { User } = require('../db/index');

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/oauth2/redirect/google',
  scope: ['profile'],
}, ((accessToken, refreshToken, profile, cb) => {
  // Standardized profile that returns from Google, check it out with console log below
  // console.log(profile);
  User.findOrCreate({ googleId: profile.id, name: profile.displayName })
    .then((data) => {
      cb(null, data);

      //   User.create({
      //     googleId: profile.id (string),
      //     name: profile.displayName
      //     friends: Array,
      //     wallet: Number,
      //   })
    })
    .catch((err) => {
      console.error(' ', err);
      cb(err);
    });
})));

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Authorization routes
const authRouter = express.Router();

authRouter.get('/login', (req, res) => {
  res.render('login');
});

authRouter.get('/login/federated/google', passport.authenticate('google'));

authRouter.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/home',
  failureRedirect: '/login',
}));

authRouter.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    return res.redirect('/');
  });
});

module.exports = { authRouter };
