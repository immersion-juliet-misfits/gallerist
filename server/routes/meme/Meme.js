const express = require('express');
const mongoose = require('mongoose');

const MemeRouter = express.Router();

const { User, Meme } = require('../../db/index');

MemeRouter.get('/meme/get', (req, res) => {
  Meme.find({})
    .then((result) => {
      res.send(result).status(200);
    })
    .catch((err) => {
      console.error('Meme routes error: ', err);
      res.sendStatus(500);
    });
});

MemeRouter.get('/meme/api', (req, res) => {
  Meme.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error('Meme routes error get: ', err);
    });
});

MemeRouter.get('/meme/post', (req, res) => {
  Meme.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error('Meme routes error: ', err);
    });
});

MemeRouter.patch('/meme/update/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'bad id' });
  }

  Meme.findOneAndUpdate({ _id: id }, req.body)
    .then((result) => {
      res.send(result).status(200);
    })
    .catch((err) => {
      console.error('Meme routes error update: ', err);
      res.sendStatus(500);
    });
});

MemeRouter.delete('/meme/delete/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'bad id' });
  }

  Meme.findOneAndUpdate({ _id: id }, req.body)
    .then((result) => {
      res.send(result).status(200);
    })
    .catch((err) => {
      console.error('Meme routes error update: ', err);
      res.sendStatus(500);
    });
});

module.exports = { MemeRouter };
