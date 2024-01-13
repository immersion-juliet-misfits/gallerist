/* eslint-disable camelcase */
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const { Schema, model } = mongoose;

const db_uri = 'mongodb://localhost/gallerist';

mongoose.connect(db_uri)
  .then(() => console.log('Connection to Database successful'))
  .catch((err) => console.log('Could not connect to database ', err));

const UserSchema = new Schema({
  username: String,
  googleId: String,
  hash: String,
  salt: String,
  gallery: Object,
  friends: Array,
  wallet: Number,
});
UserSchema.plugin(findOrCreate);

const CredentialsSchema = new Schema({
  user_id: Number,
  provider: String,
  subject: String,
});
CredentialsSchema.plugin(findOrCreate);

const ArtSchema = new Schema({
  title: String,
  artist: String,
  artistDate: String,
  altText: String,
  description: String,
  century: String,
  date: Number,
  culture: String,
  imageId: Number,
  url: String,
  imageUrl: String,
  isForSale: Boolean,
  price: Number,
});

const User = model('User', UserSchema);
const Credentials = model('Credentials', CredentialsSchema);
const Art = model('Art', ArtSchema);

module.exports = { User, Credentials, Art };
