/* eslint-disable comma-dangle */
const express = require('express');

const dbRouter = express.Router();

const { User, Art, Vault, Watch } = require('../db/index');

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

// GET request to get all the watchers name and email by the art title
dbRouter.get('/db/watch/:title', (req, res) => {
  const { title } = req.params;
  Watch.find({ title })
    .then((watchers) => {
      res.status(201).send(watchers);
    })
    .catch((err) => {
      console.error('Failed to find the art being watched: ', err);
    });
});

// // GET request to get all the watchers by user id
// dbRouter.get('/db/watch/:id', (req, res) => {
//   const {  } = req.user.docs;
//   Watch.find({ title })
//     .then((watchers) => {
//       res.status(201).send(watchers);
//     })
//     .catch((err) => {
//       console.error('Failed to find the art being watched: ', err);
//     });
// });

// POST request to add the User name and email, and the Art title to the db
dbRouter.post('/db/watch/:title', (req, res) => {
  // destructure relevant user info from request
  const { name, email } = req.user.doc;
  const { isWatched } = req.body;
  // const { isWatched, name, email } = req.body;
  const { title } = req.params;
  Watch.create({ email, name, title, isWatched })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      console.error('Failed to create Watch document: ', err);
      res.sendStatus(500);
    });
});

// Delete request to remove what is being watched
dbRouter.delete('/db/watch/:id', (req, res) => {
  const { id } = req.params;

  Watch.findByIdAndDelete({ _id: id })
    .then((deleteObj) => {
      if (deleteObj) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Failed to Delete by id: ', err);
      res.sendStatus(500);
    });
});

// GET to receive all art data of only those || no conditional logic yet
dbRouter.get('/db/artOwners', (req, res) => {
  const { googleId } = req.user.doc;

  Art.find({ 'userGallery.googleId': { $ne: googleId } })
    .then((pieces) => {
      // if (data.length >= 0) {
      res.status(200).send(pieces);
      // }
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// GET random art piece from a user's collection
dbRouter.get('/db/randomArt/:googleId', (req, res) => {
  const { googleId } = req.params;
  Art.find({ 'userGallery.googleId': googleId })
    .then((data) => {
      res.send(data[Math.floor(data.length * Math.random())]);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

// GET creates a vault for user's that don't have one setup...
// ...otherwise send back existing vault data
dbRouter.post('/db/vault', (req, res) => {
  const { name, googleId } = req.user.doc;

  Art.find({ 'userGallery.googleId': googleId })
    .then((userArt) => {
      // console.log('ART DATA', data);
      Vault.findOne({ owner: req.user.doc })
        .then((vault) => {
          if (!vault) {
            Vault.create({ owner: req.user.doc, artGallery: userArt, name })
              .then((newVault) => {
                res.status(201).send(newVault);
              })
              .catch(() => {
                res.sendStatus(500);
              });
          } else {
            Vault.findOneAndUpdate({ owner: req.user.doc }, { artGallery: userArt })
              .then(() => {
              })
              .catch((err) => {
                console.log(err, 'issue with update');
              });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    });
});

dbRouter.patch('/db/vault/', (req, res) => {
  const { _id } = req.user.doc;
  const { code } = req.body;

  Vault.findOneAndUpdate({ owner: _id }, { code })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
    });
});

dbRouter.get('/db/vault', (req, res) => {
  const { _id } = req.user.doc;
  Vault.find({ owner: { $ne: _id }, code: { $exists: true } })
    .then((owners) => {
      res.status(200).send(owners);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

dbRouter.get('/db/vault/:owner', (req, res) => {
  const { owner } = req.params;
  Vault.findOne({ owner })
    .then((vault) => {
      res.send(vault);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

dbRouter.get('/db/vaultOwner/', (req, res) => {
  const { _id } = req.user.doc;
  // const { _id } = req.user.doc;
  Vault.findOne({ owner: _id })
    .then((vault) => {
      res.send(vault);
    })
    .catch(() => {
      console.error('Could not locate current user vault');
      res.sendStatus(500);
    });
});

dbRouter.post('/db/guess', (req, res) => {
  const { owner, input } = req.body;
  Vault.findOne({ owner, code: input })
    .then((vault) => {
      if (vault) {
        res.status(200).send(vault);
      } else {
        res.sendStatus(500);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

dbRouter.get('/db/heistVault/:_id', (req, res) => {
  const { _id } = req.params;
  Vault.findById(_id)
    .then((vault) => {
      if (!vault) {
        res.sendStatus(500);
      } else {
        return Promise.all(vault.artGallery.map((art) => Art.findById(art)));
      }
    })
    .then((artData) => {
      res.status(200).send(artData);
    });
});

dbRouter.post('/db/stealArt/:_id', (req, res) => {
  const { _id } = req.params;
  const { googleId } = req.user.doc;

  Art.findById(_id)
    .then(() => {
      Vault.findOneAndUpdate({ artGallery: _id }, { $pull: { artGallery: _id } })
        .then(() => {
          Vault.findOneAndUpdate({ owner: req.user.doc._id }, { $push: { artGallery: _id } })
            .then(() => {
              Art.findByIdAndUpdate(_id, { userGallery: { name: req.user.doc.name, googleId } })
                .then((data) => {
                  res.send(data);
                })
                .catch((err) => {
                  console.error('Could not update Art userGallery', err);
                });
            })
            .catch((err) => {
              console.error('Could not add art from loot', err);
            });
        })
        .catch(() => {
          console.error('Could not take art from user');
        });
    })
    .catch(() => {
      console.error('Could not locate art');
    });
});
module.exports = { dbRouter };
