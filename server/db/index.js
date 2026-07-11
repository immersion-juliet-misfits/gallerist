const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
require('dotenv').config();

const { Schema, model } = mongoose;
// eslint-disable-next-line camelcase
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
  vouchers: {
    type: Number,
    default: 0,
  },
  quizHighScore: Number,
  quizTotalScore: Number,
});
UserSchema.plugin(findOrCreate);

const ArtSchema = new Schema({
  title: String,
  artist: String,
  date: String,
  culture: String,
  url: String,
  imageUrl: String,
  userGallery: Object,
  isForSale: Boolean,
  price: Number,
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const MemeSchema = new Schema({
  title: String,
  imageUrl: String,
  options: Object,
  user_id: String,
  imageId: String,
});

const ShowcaseSchema = new Schema({
  curator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  curatorName: String,
  isDraft: {
    type: Boolean,
    default: true,
  },
  title: String,
  message: String,
  playlist: [String],
  shuffle: Boolean,
  artPieces: [{
    type: Schema.Types.ObjectId,
    ref: 'Art',
  }],
  startDate: Date,
  endDate: Date,
  auctionDate: Date, // For future expansion
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

// eslint-disable-next-line camelcase
const AIC_Schema = new Schema({
  id: { type: Number, required: true },
  image_id: { type: String, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const WatchedSchema = new Schema({
  email: {
    type: Schema.Types.String,
    ref: 'User',
  },
  name: {
    type: Schema.Types.String,
    ref: 'User',
  },

  title: {
    type: Schema.Types.String,
    ref: 'Art',
  },
  message: String,
  isWatched: Boolean,
});

const UserArtSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  posted: {
    type: Boolean,
    default: false,
  },
});

const User = model('User', UserSchema);
const Art = model('Art', ArtSchema);
const Meme = model('Meme', MemeSchema);
const Showcase = model('Showcase', ShowcaseSchema);
const Vault = model('Vault', VaultSchema);
const AICart = model('AICart', AIC_Schema);
const Watch = model('Watch', WatchedSchema);
const UserArt = Art.discriminator('UserArt', UserArtSchema);

const BlackMarketArt = Art.discriminator('BlackMarket', new Schema({
  itemType: { type: String, enum: ['painting', 'voucher'], default: 'painting' },
  ownerId: { type: String, default: 'black_market' },
  haggleCount: { type: Number, default: 0 },
  voucherValue: { type: Number, default: 0 },
  artwork: { type: Schema.Types.ObjectId, ref: 'Art', sparse: true },
}));

module.exports = {
  User, Art, Meme, Vault, AICart, Watch, UserArt, BlackMarketArt, Showcase,
};
