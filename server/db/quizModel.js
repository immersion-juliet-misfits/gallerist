/* eslint-disable camelcase */
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const { Schema, model } = mongoose;
// const db_uri = process.env.DB_URI;

// Original File is connecting to Mongo,m may not need this
// mongoose
//   .connect(db_uri)
//   .then(() => console.log('DB Connect: Success'))
//   .catch((err) => console.log('DB Connect: Failed ', err));

// Quiz Table will track User High score, and what else?
const GameSchema = new Schema({
  highScore: { type: Number },
});
GameSchema.plugin(findOrCreate);

// Will save some Art data to DB so it's not constantly pulling
const AIC_Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  imageId: { type: String, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const Game = model('Game', GameSchema);
const AIC_Art = model('AIC_Art', AIC_Schema);

module.exports = { Game, AIC_Art };
