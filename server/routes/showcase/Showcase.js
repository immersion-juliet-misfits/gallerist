const express = require('express');
const mongoose = require('mongoose');

const showcaseRouter = express.Router();

const { Showcase } = require('../../db/index');

// READ: all published showcases, for the public browse list (drafts stay hidden)
showcaseRouter.get('/get', (req, res) => {
  Showcase.find({ isDraft: false })
    .then((showcases) => {
      res.status(200).send(showcases);
    })
    .catch((err) => {
      console.error('Showcase find all: Failed ', err);
      res.sendStatus(500);
    });
});

// READ: single showcase detail, art pieces populated for the slideshow view
showcaseRouter.get('/get/:id', (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'bad id' });
    return;
  }
  Showcase.findById(id)
    .populate('artPieces')
    .then((showcase) => {
      if (showcase) {
        res.status(200).send(showcase);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Showcase find by id: Failed ', err);
      res.sendStatus(500);
    });
});

// READ: showcases belonging to the logged-in user, drafts and active both
// (this feeds the Profile management view)
showcaseRouter.get('/mine', (req, res) => {
  const { _id } = req.user.doc;
  Showcase.find({ curator: _id })
    .then((showcases) => {
      res.status(200).send(showcases);
    })
    .catch((err) => {
      console.error('Showcase find mine: Failed ', err);
      res.sendStatus(500);
    });
});

// CREATE: new showcase, draft or published depending on isDraft
showcaseRouter.post('/create', (req, res) => {
  const { _id, name } = req.user.doc;
  const {
    title,
    message,
    playlist,
    shuffle,
    artPieces,
    startDate,
    endDate,
    auctionDate,
    isDraft,
  } = req.body;

  Showcase.create({
    curator: _id,
    curatorName: name,
    title,
    message,
    playlist,
    shuffle,
    artPieces,
    startDate,
    endDate,
    auctionDate,
    isDraft,
  })
    .then((newShowcase) => {
      res.status(201).send(newShowcase);
    })
    .catch((err) => {
      console.error('Showcase create: Failed ', err);
      res.sendStatus(500);
    });
});

// UPDATE: edit fields / add-remove art pieces / toggle isDraft (curator only)
showcaseRouter.patch('/update/:id', (req, res) => {
  const { id } = req.params;
  const { _id } = req.user.doc;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'bad id' });
    return;
  }

  Showcase.findOneAndUpdate({ _id: id, curator: _id }, req.body, { new: true })
    .then((updated) => {
      if (updated) {
        res.status(200).send(updated);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Showcase update: Failed ', err);
      res.sendStatus(500);
    });
});

// DELETE: remove showcase (curator only)
showcaseRouter.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const { _id } = req.user.doc;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: 'bad id' });
    return;
  }

  Showcase.findOneAndDelete({ _id: id, curator: _id })
    .then((deleted) => {
      if (deleted) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Showcase delete: Failed ', err);
      res.sendStatus(500);
    });
});

module.exports = { showcaseRouter };
