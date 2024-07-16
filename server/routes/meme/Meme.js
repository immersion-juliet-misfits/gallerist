const express = require('express');

const MemeRouter = express.Router();

// const { User, Meme = require('../db/index');

MemeRouter.get('/meme/get', (req, res) => {
  res.send({ mess: 'test' });
});

module.exports = { MemeRouter };
