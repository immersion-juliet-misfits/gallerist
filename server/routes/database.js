/* eslint-disable comma-dangle */
const express = require('express');

const dbRouter = express.Router();

const { User, Art, AICart } = require('../db/index');
// const { User, Art } = require('../db/index');

// GET: to return user's profile info upon load of Profile component (could be used elsewhere)
dbRouter.get('/db/user/', (req, res) => {
  // gets mongo document _id property from request when user clicks profile
  User.findById(req.user.doc._id)
    .then((userDoc) => {
      res.status(200).send(userDoc);
    })
    .catch((err) => {
      console.error('Failed to find User by id: ', err);
      res.sendStatus(500);
    });
});

// Returns all user names (with mongo _id in an object)
dbRouter.get('/db/users/', (req, res) => {
  User.find({}, 'name')
    .then((userNames) => {
      res.status(200).send(userNames);
    })
    .catch((err) => {
      console.error('Failed to find Users: ', err);
      res.sendStatus(500);
    });
});

// USERS Routes: Update via a Put request
// don't think this endpoint was ever used, was written to allow user to change username
// was also used for a while to update gallery object on user,
// but that was deleted as it caused a double source of truth
// '/db/user/:id'
dbRouter.put('/db/user/:id', (req, res) => {
  const { id } = req.params;
  const fieldsToUpdate = req.body; // gallery: {imageid: artObj} or username: 'so-and-so'
  User.findByIdAndUpdate(id, fieldsToUpdate)
    .then(() => {
      res.sendStatus(200);
      // res.sendStatus(404); //when we figure out what updObj looks like
    })
    .catch((err) => {
      console.error('Failed to update by user id: ', err);
      res.sendStatus(500);
    });
});

// For pricing feature, to pay owner of art and increment wallet
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

// For pricing feature, to deduct money from wallet upon purchase
dbRouter.put('/db/deductWallet/', (req, res) => {
  const { _id } = req.user.doc;
  const { price } = req.body;
  User.findByIdAndUpdate(_id, { $inc: { wallet: -price } }, { new: true })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Failed to pay wallet of user: ', err);
      res.sendStatus(500);
    });
});

// GETs all Art documents from Art table in database
dbRouter.get('/db/art/', (req, res) => {
  Art.find({})
    .then((docs) => {
      res.status(200).send(docs);
    })
    .catch((err) => {
      console.error('Failed to find Art: ', err);
      res.sendStatus(500);
    });
});

// GETs specific Artwork based on imageId sent
dbRouter.get('/db/artwork/:imageId', (req, res) => {
  const { imageId } = req.params;
  Art.find({ imageId })
    .then((artwork) => {
      if (artwork) {
        res.status(200).send(artwork);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Failed to find artwork by imageId: ', err);
      res.sendStatus(500);
    });
});

// GET all Art based on user sending request
dbRouter.get('/db/userArt/', (req, res) => {
  const { googleId } = req.user.doc;
  Art.find({ 'userGallery.googleId': googleId })
    .then((docs) => {
      res.status(200).send(docs);
    })
    .catch((err) => {
      console.error('Failed to find Art: ', err);
      res.sendStatus(500);
    });
});

// GET all art based on :user Filter, returns all art documents of user
// *** based on 'name' property of userGallery obj ***
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

// GET all art based on :culture filter, returns all art documents with a given culture
dbRouter.post('/db/culture/:culture', (req, res) => {
  const { culture } = req.params;
  const { name } = req.body;
  Art.find({ culture })
    .then((cultureArt) => {
      if (cultureArt.length) {
        // check if name is defined, if it is then query
        if (!name) {
          res.status(200).send(cultureArt);
        } else {
          Art.find({ culture })
            .where({ 'userGallery.name': name })
            .then((bothArt) => {
              if (bothArt.length) {
                res.status(200).send(bothArt);
              }
            })
            .catch(() => res.sendStatus(404));
        }
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(`Failed to find ${culture} artwork: `, err);
      res.sendStatus(500);
    });
});

// Updates art object.  Used in Profile and Auction for listing/unlisting/purchasing of art.
// Takes parameter of imageId as the filter object,
// then fields in req.body are part of update object,
// Lastly, takes googleId and name from req.user.doc
// to update userGallery field based on which user sent request
dbRouter.put('/db/art/:imageId', (req, res) => {
  const { imageId } = req.params;
  const { googleId, name } = req.user.doc;
  const fieldsToUpdate = req.body;
  Art.findOneAndUpdate(
    { imageId },
    { ...fieldsToUpdate, userGallery: { name, googleId } },
    { new: true }
  )
    .then((updObj) => {
      if (updObj) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Failed to Update art by imageId: ', err);
    });
});

// Delete request to remove Art object's from gallery
dbRouter.delete('/db/art/:imageId', (req, res) => {
  const { imageId } = req.params;
  Art.findOneAndDelete({ imageId })
    .then((deleteObj) => {
      if (deleteObj) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Failed to Delete by imageId: ', err);
      res.sendStatus(500);
    });
});

// PUT request to update User's friend array
dbRouter.put('/db/friends/', (req, res) => {
  const { friend } = req.body; // req.body should be { friend: `friend's name` }
  const { googleId } = req.user.doc;
  User.findOne({ googleId })
    .then((user) => {
      // added conditional to prevent self-friending or duplication in friends array
      if (user.name !== friend && !user.friends.includes(friend)) {
        User.findByIdAndUpdate(
          user._id,
          { $push: { friends: friend } },
          { new: true }
        ).then(() => {
          res.sendStatus(200);
        });
      } else {
        res.sendStatus(204); // axios doesn't like 304 statuses
      }
    })
    .catch((err) => {
      console.error('Failed to update user friend array: ', err);
      res.sendStatus(500);
    });
});

// PUT request to remove friend from friends' list
dbRouter.put('/db/unfriend/', (req, res) => {
  const { friend } = req.body;
  const { googleId } = req.user.doc;
  User.findOne({ googleId })
    .then((user) => {
      // Might be a mongoose trick to do this,
      // but I just find the index of the string of the friend's name
      const idx = user.friends.indexOf(friend);
      // ...and splice it out (splice is mutative/destructive)
      user.friends.splice(idx, 1);
      // Then update the user document that was just found with the new array
      User.findOneAndUpdate(
        user._id,
        { friends: user.friends },
        { new: true }
      ).then(() => {
        res.sendStatus(200);
      });
    })
    .catch((err) => {
      console.error('Failed to Put update to friend list: ', err);
      res.sendStatus(500);
    });
});

// GET request to get art Objects based on 'isForSale' boolean for use in Auction feature
dbRouter.get('/db/auction/', (req, res) => {
  Art.find({ isForSale: true })
    .then((forSaleArt) => {
      res.status(200).send(forSaleArt);
    })
    .catch((err) => {
      console.error('Failed to find art by isForSale: ', err);
      res.sendStatus(500);
    });
});

// ART Routes: create() via a Post needs to come once we have the full art obj
// POST '/db/art/ ==> req.body will contain fields corresponding to Art Schema
dbRouter.post('/db/art', (req, res) => {
  // destructure relevant user info from request
  const { name, googleId } = req.user.doc;
  const { art } = req.body;

  // Spread contents of art object from req.body into document creation object,
  // along with userGallery field to associate with user that is curating this artwork
  Art.create({ ...art, userGallery: { name, googleId } })
    .then(() => {
      // send 201 status in response
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error('Failed to create Art document: ', err);
      res.sendStatus(500);
    });
});
/**
   * All of these fields are available in art object returned from GET: 'huam/object/:id'
  title: String,
  artist: String,
  date: Number,
  culture: String,
  imageId: Number,
  url: String,
  imageUrl: String,
  isForSale: False, //initialize to false
  */
// *** Quiz Routes Below Here ***

// Create: POST create() - Create new table to store data pulled from AIC per game started
// Create temp DB table that stores 10
// This HANDLES the client POST request
dbRouter.post('/db/quizart', (req, res) => {
  console.log(
    'database.js quizart POST invocation check',
    typeof req,
    typeof res
  );
  console.log('DB.js REQ Check', req.body); // No data or body
  // When req.body isn't empty, I need
  const artData = req.body;
  // This needs the data from AIC GET req to create a new entry in the table
  // How are the above methods retrieving data from the Harvard API

  AICart.create(artData)
    .then(() => {
      console.log('AICart Create: Success');
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error('Failed to Create Art document', err);
      res.status(500).send('Failed 2.0');
    });
});

// Retrieve: GET Art data saved in DB
dbRouter.get('/db/quizart', (req, res) => {
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

module.exports = { dbRouter };
