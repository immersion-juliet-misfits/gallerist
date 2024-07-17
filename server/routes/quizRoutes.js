const express = require('express');

const quizRouter = express.Router();

const { User } = require('../db/index');

// Create: POST create() - Create Score Table per User? Create Game session?
// quizRouter.post('/db/__?', (req, res) => {
//   ___.create({})
//     .then(() => {
//       res.sendStatus(201);
//     })
//     .catch((err) => {
//       console.error('Failed to ___ : ', err);
//       res.sendStatus(500);
//     });
// }

// Retrieve: GET  - User Profile info for access to their wallet
// quizRouter.get('/db/user/', (req, res) => {
//   // gets mongo document _id property from request when user clicks profile
//   User.findById(req.user.doc._id)
//     .then((userDoc) => {
//       res.status(200).send(userDoc);
//     })
//     .catch((err) => {
//       console.error('Failed to find User by id: ', err);
//       res.sendStatus(500);
//     });
// });

// Update: PUT / PATCH - increase User money total
// For pricing feature, to pay owner of art and increment wallet
quizRouter.put('/db/giveMoney/:name', (req, res) => {
  const { name } = req.params;
  const { price } = req.body;
  User.findOneAndUpdate({ name }, { $inc: { wallet: price } }, { new: true })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Failed to pay wallet of user: ', err);
      res.sendStatus(500);
    });
});

// Delete x 2 - Delete Game Session?
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

module.exports = { quizRouter };
