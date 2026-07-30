const express = require('express');
const { likesRouter } = require('./likes');
const { commentsRouter } = require('./comments');

const app = express();

app.use('/likes', likesRouter);
app.use('/comments', commentsRouter);

module.exports = app;
