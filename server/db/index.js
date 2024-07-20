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

const VaultSchema = new Schema({
  name: String,
  owner: {
    // **mongoose references other schemas like this**
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  code: {
    type: String,
  },
  artGallery: [{
    type: Schema.Types.ObjectId,
    ref: 'Art',
  }],
});

const WatchedSchema = new Schema({
  userData: [
    {
      email: {
        type: Schema.Types.String,
        ref: 'User',
      },
      name: {
        type: Schema.Types.String,
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
const Vault = model('Vault', VaultSchema);
const Watch = model('Watch', WatchedSchema);

module.exports = { User, Art, Vault, Watch };
