/* eslint-disable comma-dangle */
const express = require('express');

const quizRouter = express.Router();

const { AICart } = require('../db/index');

// *** Quiz Routes Below Here ***

// Create: POST create() - Create new table to store data pulled from AIC per game started
// Create temp DB table that stores 10
// This HANDLES the client POST request
quizRouter.post('/db/quizart', (req, res) => {
  console.log('Req Body Verified: ', req.body);
  // const { id, image_id, title } = req.body;
  const artData = req.body.map((art) => ({
    ...art,
    imageUrl: `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`,
  }));

  AICart.create(artData)
    .then(() => {
      console.log('AICart Create: Success');
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error('AICart Create: Failed', err);
      res.status(500).send('AICart Create: Failed');
    });
});

// Retrieve 1: GET Art data saved in DB
quizRouter.get('/db/quizart', (req, res) => {
  console.log('Verifying GET request to /db/quizart');

  AICart.find({})
    .then((data) => {
      if (data) {
        console.log('Retrieve AIC Art from DB: Success ', data);
        res.status(200).json(data); // Send retrieved data as JSON?
        // res.status(200).send(data); //
      } else {
        console.log('AIC Art DB Empty');
        res.status(404).send('AIC Art DB Empty');
      }
    })
    .catch((err) => {
      console.error('Retrieve AIC Art from DB: Failed ', err);
      res.status(500).send('Internal Server Error');
    });
});

// Delete - Remove Table that random Art & Titles were pulled to to avoid overloading DB
// quizRouter.delete('/db/___?', (req, res) => {
//   const {  } = req.params;
//   ___.findOneAndDelete({  })
//     .then(() => {
//       if () {
//         res.sendStatus(200);
//       } else {
//         res.sendStatus(404);
//       }
//     })
//     .catch((err) => {
//       console.error('Failed to: ', err);
//       res.sendStatus(500);
//     });
// });

// Retrieve 2: GET - User Profile info for access to their wallet
// Use the function in the other file instead of trying to make another

// Retrieve 3: GET - Retrieve Users previous highs core
// quizRouter.get('/db/quizscore', (req, res) => {
//   .
// } );

// Update 1: PATCH - Increase money in wallet at end of game based on score.
// Use the function in the other file instead of trying to make another

// Update 2: PATCH - Update the Users High Score if they have surpassed it
// quizRouter.patch('/db/quizscore', (req, res) => {
// const { } = req.params;
// const { } = req.body;
// console.log('Score Patch Param Check', req.params);
// console.log('Score Patch Body Check', req.body);
// User.findOneAndUpdate({ name }, { objWith: Score_data }, { new: true })
//   .then(() => {
//     res.sendStatus(200);
//   })
//   .catch((err) => {
//     console.error('Failed to Update Users high score: ', err);
//     res.sendStatus(500);
//   });
// });

module.exports = { quizRouter };
