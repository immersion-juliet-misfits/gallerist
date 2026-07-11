const express = require('express');
const { likesRouter } = require('./likes');

const app = express();

app.use('/likes', likesRouter);

module.exports = app;
