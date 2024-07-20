/* eslint-disable max-len */
/* eslint-disable comma-dangle */
const express = require('express');

const quizRouter = express.Router();

const { AICart, User } = require('../db/index');

// Create: POST create() - Create new table to store data pulled from AIC per game started
// Create temp DB table that stores enough data for 1 game session
// Req handler for client POST req to retrieve data from AIC & save it
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

// Delete - Empty the Art & Title collection to avoid overloading DB
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

// ****** Game Score ReqHandlers
/*
You can NOT (normally) test these kinds of reqs that use 'req.user.doc._id' in Postman.
Because the way this project is set up, this data is ACTUALLY pulled directly from the browser, not the DB.
You have to write a unique kind of PM req, that ive saved an example of as: 'GET User Info from DB'.
And use  const { _id } = req.body;  while testing PM.
** IMPORTANT NOTE IF I empty the User DB for testing, I will have to replace the "_id" in the PM req because my account will have a new ObjectId.

The REAL way to test & use this is via client side Axios requests and: const { _id } = req.user.doc;
 The 'req.user.doc' is getting the user object directly from the browser
 The the data inside of it is from the User schema.

 */
// Retrieve: GET - Retrieve Users previous high score
// STOP using the same Endpoints as other route files
// This function is currently returning the entire user OBJ
quizRouter.get('/db/userScore/', (req, res) => {
    // console.log('User Req Params: ', req.params); // Empty
    // console.log('User Req Body: ', req.body); // Logs the ID I entered in my PM req
  const { _id } = req.body; // Using this to test in PM since there is no client
  // const { _id } = req.user.doc; // Required for Production
  User.findById(_id) // Targets the User using the browser currently
    .then((data) => {
      // if score exists
      if (data) {
        console.log('High Score: ', data.quizHighScore);
        // res.status(200).send(data);  // Sends entire OBJ with no problem
        // res.status(200).send(data.quizHighScore); // Cause error & a loop
        res.status(200).json(data.quizHighScore); // Sends the 1 value I'm after
      } else {
        // if it doesn't exist it will (hopefully) be created with a value of 0
        res.status(404).send('Score Not Found');
      }
    })
    .catch((err) => {
      console.error('User Data Retrieval: Failed: ', err);
      res.sendStatus(500);
    });
});

/*
Reference to write GET to retrieve Users high score

GET all art based on :user Filter, returns all art documents of user
*** based on 'name' property of userGallery obj ***
dbRouter.get('/db/art/:user', (req, res) => {
  const { user } = req.params;
  Art.find({ 'userGallery.name': user })
    .then((userArt) => {
      if (userArt.length) {
        res.status(200).send(userArt);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(`Failed to find ${user}'s artwork: `, err);
      res.sendStatus(500);
    });
});

 */

// Update: PATCH - Update the Users High Score if they have surpassed it
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

/*
Reference to write req handler for creating & updating Users high score
why do they use PUT instead of PATCH

For pricing feature, to pay owner of art and increment wallet
dbRouter.put('/db/giveMoney/:name', (req, res) => {
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

*/

module.exports = { quizRouter };
