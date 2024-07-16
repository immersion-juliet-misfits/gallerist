/* eslint-disable camelcase */
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const { Schema, model } = mongoose;
const db_uri = process.env.DB_URI;

mongoose.connect(db_uri)
  .then(() => console.log('Connection to Database successful'))
  .catch((err) => console.log('Could not connect to database ', err));

const UserSchema = new Schema({
  // username: String,
  googleId: String,
  name: String,
  // gallery: Array,
  friends: Array,
  wallet: Number,
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

const User = model('User', UserSchema);
const Art = model('Art', ArtSchema);

module.exports = { User, Art };
