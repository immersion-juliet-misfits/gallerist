/* eslint-disable camelcase */
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const { Schema, model } = mongoose;
const db_uri = process.env.DB_URI;

mongoose
  .connect(db_uri)
  .then(() => console.log('Connection to Database successful'))
  .catch((err) => console.log('Could not connect to database ', err));

const UserSchema = new Schema({
  // username: String,
  googleId: String,
  name: String,
  // gallery: Array,
  friends: Array,
  wallet: Number,
  quizHighScore: Number,
});
UserSchema.plugin(findOrCreate);

const ArtSchema = new Schema({
  title: String,
  artist: String,
  date: String,
  culture: String,
  imageId: {
    type: Number,
    unique: true,
  },
  url: String,
  imageUrl: String,
  userGallery: Object,
  isForSale: Boolean,
  price: Number,
});

// *** Schemas for Quiz Game ***
// Instead of a new Table, add to the Users table
// Quiz Table will track all Users High score -
// 1 User - 1 high score
const GameSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true, unique: true }, // How to ref UserIds?
  highScore: { type: Number },
});
GameSchema.plugin(findOrCreate);

// Will Create & Delete an entry in DB for each game
// 1 User - 1 Game Table to pull assets from
const AIC_Schema = new Schema({
  id: { type: Number, required: true },
  image_id: { type: String, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const User = model('User', UserSchema);
const Art = model('Art', ArtSchema);
const AICart = model('AICart', AIC_Schema);
const GameScore = model('GameScore', GameSchema);

module.exports = {
  User,
  Art,
  AICart,
  GameScore,
};
