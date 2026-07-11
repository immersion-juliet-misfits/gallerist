const express = require('express');

const likesRouter = express.Router();

const { Art } = require('../../db/index');

/**
 * Patch request updates the like info on the image
 * Should increment, decrement, or leave likes / dislikes
 * after finding the image on the server
 */
likesRouter.patch('/art/:imageId', (req, res) => {
  const { imageId } = req.params;
  const { likeInfo } = req.body; // { likes: 1/0/-1, dislikes: 1/0/-1 }

  Art
    .findOne({ imageId })
    .then((art) => {
      if (art) {
        Art
          .findOneAndUpdate(
            art,
            {
              likes: art.likes + likeInfo.likes,
              dislikes: art.dislikes + likeInfo.dislikes,
            }
          )
          .then(() => res.sendStatus(200));
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Failed to update likes/dislikes on art:', err);
      res.sendStatus(500);
    });
});

module.exports = { likesRouter };
