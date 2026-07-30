const express = require('express');
const mongoose = require('mongoose');

const showcaseRouter = express.Router();

const { Showcase } = require('../../db/index');

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Lock art pieces to one active showcase (draft or active) at a time.
function findConflictingArtIds(artPieces, excludeId) {
  if (!artPieces || !artPieces.length) {
    return Promise.resolve([]);
  }
  const query = {
    artPieces: { $in: artPieces },
    $or: [
      { isDraft: true },
      { isDraft: false, endDate: null },
      { isDraft: false, endDate: { $gte: new Date() } },
    ],
  };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return Showcase.find(query).then((conflicts) => {
    const requested = new Set(artPieces.map(String));
    const conflicting = new Set();
    conflicts.forEach((showcase) => {
      showcase.artPieces.forEach((pieceId) => {
        const idStr = String(pieceId);
        if (requested.has(idStr)) {
          conflicting.add(idStr);
        }
      });
    });
    return Array.from(conflicting);
  });
}

// READ: all published showcases, for the public browse list (drafts stay hidden)
// Expired showxases drop off but remain visible via the curator's own PalGallery page
showcaseRouter.get('/get', (req, res) => {
  Showcase.find({
    isDraft: false,
    $or: [{ endDate: null }, { endDate: { $gte: new Date() } }],
  })
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

// READ: all published showcases by a specific curator, for their public PalGallery page
// This never filters by endDate, so a curator's own page keeps
// every showcase they've published, even after it expires and drops off the main Showcase list
showcaseRouter.get('/curator/:curatorName', (req, res) => {
  const { curatorName } = req.params;
  Showcase.find({ curatorName, isDraft: false })
    .then((showcases) => {
      res.status(200).send(showcases);
    })
    .catch((err) => {
      console.error('Showcase find by curator: Failed ', err);
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
    description,
    playlist,
    shuffle,
    artPieces,
    startDate,
    endDate,
    auctionDate,
    isDraft,
  } = req.body;

  findConflictingArtIds(artPieces).then((conflicts) => {
    if (conflicts.length) {
      res.status(409).json({
        error: 'Some art pieces are already in another showcase',
        conflicts,
      });
      return;
    }

    let effectiveStartDate = startDate;
    let effectiveEndDate = endDate;
    if (isDraft === false) {
      effectiveStartDate = startDate || new Date();
      effectiveEndDate = endDate
        || new Date(new Date(effectiveStartDate).getTime() + ONE_WEEK_MS);
    }

    Showcase.create({
      curator: _id,
      curatorName: name,
      title,
      description,
      playlist,
      shuffle,
      artPieces,
      startDate: effectiveStartDate,
      endDate: effectiveEndDate,
      auctionDate,
      isDraft,
    })
      .then((newShowcase) => {
        res.status(201).send(newShowcase);
      })
      .catch((err) => {
        console.error(
          'Showcase conflict check: Failed ',
          err,
        );
        res.sendStatus(500);
      });
  });

  let effectiveStartDate = startDate;
  let effectiveEndDate = endDate;

  if (isDraft === false) {
    effectiveStartDate = startDate || new Date();
    effectiveEndDate = endDate || new Date(new Date(effectiveStartDate).getTime() + ONE_WEEK_MS);
  }

  Showcase.create({
    curator: _id,
    curatorName: name,
    title,
    description,
    playlist,
    shuffle,
    artPieces,
    startDate: effectiveStartDate,
    endDate: effectiveEndDate,
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

  Showcase.findOne({ _id: id, curator: _id })
    .then((existing) => {
      if (!existing) {
        res.sendStatus(404);
        return null;
      }

      const updateBody = { ...req.body };

      return findConflictingArtIds(updateBody.artPieces, id).then((conflicts) => {
        if (conflicts.length) {
          res.status(409).json({
            error: 'Some art pieces are already in another showcase',
            conflicts,
          });
          return null;
        }

        const goingLive = updateBody.isDraft === false
        || (updateBody.isDraft === undefined && existing.isDraft === false);

        if (goingLive) {
          const effectiveStartDate = updateBody.startDate || existing.startDate || new Date();

          updateBody.startDate = effectiveStartDate;
          updateBody.endDate = updateBody.endDate
          || existing.endDate
          || new Date(new Date(effectiveStartDate).getTime() + ONE_WEEK_MS);
        }

        return Showcase.findOneAndUpdate({ _id: id, curator: _id }, updateBody, {
          new: true,
        });
      });
    })
    .then((updated) => {
      if (updated) {
        res.status(200).send(updated);
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
