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
  email: String,
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

const WatchedSchema = new Schema({
  userData: [
    {
      email: {
        type: Schema.Types.Array,
        ref: 'User',
      },
      name: {
        type: Schema.Types.Array,
        ref: 'User',
      },
    },
  ],

  title: {
    type: Schema.Types.String,
    ref: 'Art',
  },
  message: String,
});

const User = model('User', UserSchema);
const Art = model('Art', ArtSchema);
const Watch = model('Watch', WatchedSchema);

module.exports = { User, Art, Watch };
