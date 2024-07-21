const express = require('express');

const quizRouter = express.Router();

const { AICart, User } = require('../db/index');

quizRouter.post('/db/quizart', (req, res) => {
  const filteredData = req.body.filter(
    (art) => art.id && art.image_id && art.title,
  );
  const artData = filteredData.map((art) => ({
    ...art,
    imageUrl: `https://www.artic.edu/iiif/2/${art.image_id}/full/500,/0/default.jpg`,
  }));

  AICart.create(artData)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error('AICart Create: Failed', err);
      res.status(500).send('AICart Create: Failed');
    });
});

quizRouter.get('/db/quizart', (req, res) => {
  AICart.find({})
    .then((qArt) => {
      if (qArt) {
        res.status(200).json(qArt);
      } else {
        res.status(404).send('AIC Art DB Empty');
      }
    })
    .catch((err) => {
      console.error('Retrieve AIC Art from DB: Failed ', err);
      res.status(500).send('Internal Server Error');
    });
});

quizRouter.delete('/db/quizart', (req, res) => {
  AICart.deleteMany({})
    .then((deleted) => {
      if (deleted.deletedCount > 0) {
        res.status(200).send('Find & Deletion: Success');
      } else {
        res.status(404).send('Find: Failed');
      }
    })
    .catch((err) => {
      console.error('Deletion Attempt: Failed: ', err);
      res.sendStatus(500);
    });
});

quizRouter.get('/db/userScore/', (req, res) => {
  const { _id } = req.body;
  User.findById(_id)
    .then((hScore) => {
      if (hScore) {
        res.status(200).json(hScore.quizHighScore);
      } else {
        res.status(404).send('Score Not Found');
      }
    })
    .catch((err) => {
      console.error('User High Score Retrieval: Failed: ', err);
      res.sendStatus(500);
    });
});

quizRouter.put('/db/userScore', (req, res) => {
  const { _id } = req.user.doc;
  const { quizHighScore } = req.body;

  User.findByIdAndUpdate(_id, { quizHighScore }, { new: true })
    .then((newScore) => {
      if (newScore) {
        res.status(200).send(newScore);
      } else {
        res.status(404).send('Score Not Found');
      }
    })
    .catch((err) => {
      console.error('Quiz High Score Update: Failed ', err);
      res.sendStatus(500);
    });
});

quizRouter.put('/db/userRunningScore', (req, res) => {
  const { _id } = req.user.doc;
  const { currScore } = req.body;

  User.findByIdAndUpdate(
    _id,
    { $inc: { quizTotalScore: currScore } },
    { new: true }
  )
    .then((updateScore) => {
      if (updateScore) {
        res.status(200).send(updateScore);
      } else {
        res.status(404).send('Running Score Not Found');
      }
    })
    .catch((err) => {
      console.error('Quiz Running Score Update: Failed ', err);
      res.sendStatus(500);
    });
});

module.exports = { quizRouter };
