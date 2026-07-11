const express = require('express');

const blackMarketRouter = express.Router();
// import models
const {
  User,
  Art,
  Vault,
  BlackMarketArt,
} = require('../db/index');

// POST- a new Black Market listing should be posted whenever art is sold to the Black Market
blackMarketRouter.post('/db/blackmarket/sell/:_id', (req, res) => {
  const { _id } = req.params;
  const userId = req.user.doc._id;

  let artData;

  Art.findById(_id)
    .then((art) => {
      artData = art;
      return Vault.findOneAndUpdate({ owner: userId }, { $pull: { artGallery: _id } });
    })
    .then(() => Art.findByIdAndUpdate(_id, {
      userGallery: { name: 'The Black Market', googleId: 'black_market' },
    }))
    .then(() => BlackMarketArt.create({
      title: artData.title,
      url: artData.url,
      imageUrl: artData.imageUrl,
      ownerId: 'black_market',
      price: 5000,
      artwork: _id,
    }))
    .then((newListing) => User.findByIdAndUpdate(userId, { $inc: { wallet: 1000 } })
      .then(() => res.status(201).send(newListing)))
    .catch((err) => {
      console.error('Failed to sell to Black Market', err);
      res.sendStatus(500);
    });
});

// GET route that allows for the black market paintings and vouchers to be viewed
blackMarketRouter.get('/db/blackmarket', (req, res) => {
  BlackMarketArt.find({ ownerId: 'black_market' })
    .then((listings) => {
      const shuffled = listings.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);

      res.status(200).send(selected || []);
    })
    .catch((err) => {
      console.error('Failed to retrieve Black Market Art listings', err);
      res.sendStatus(500);
    });
});

// PATCH route that updates a user's voucher number when they use it
blackMarketRouter.patch('/db/blackmarket/voucher/:itemId', (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.doc._id;

  BlackMarketArt.findById(itemId)
    .then((item) => {
      if (!item || item.itemType !== 'voucher') {
        return res.status(400).send('Invalid item type');
      }

      return User.findByIdAndUpdate(userId, { $inc: { wallet: item.voucherValue } })
        .then(() => BlackMarketArt.findByIdAndDelete(itemId))
        .then(() => res.sendStatus(200));
    })
    .catch((err) => {
      console.error('Failed to redeem voucher', err);
      res.sendStatus(500);
    });
});

// PATCH route that allows a user to haggle
// after each haggle the price will increase or decrease depending on success or fail
blackMarketRouter.patch('/db/blackmarket/haggle', (req, res) => {
  const { listingIds } = req.body;

  if (!listingIds || !listingIds.length) {
    return res.sendStatus(400);
  }

  // 50/50 chance for success or failure
  const isSuccess = Math.random() >= 0.5;
  // on success = 75% of cost, -25% discount
  // on fail = 125% of cost, +25% increase
  const multiplier = isSuccess ? 0.75 : 1.25;

  return BlackMarketArt.find({ _id: { $in: listingIds } })
    .then((listings) => {
      const updatePromises = listings.map((listing) => {
        // use default 5000 if price isn't set yet
        const currentPrice = listing.price || 5000;
        let newPrice = Math.floor(currentPrice * multiplier);
        // lowest discount can go is to $10
        if (newPrice < 10) newPrice = 10;

        return BlackMarketArt.findByIdAndUpdate(
          listing._id,
          {
            price: newPrice,
            $inc: { haggleCount: 1 },
          },
          { new: true },
        ).populate('artwork');
      });

      return Promise.all(updatePromises);
    })
    .then((updatedListings) => {
      res.status(200).send({
        success: isSuccess,
        listings: updatedListings,
      });
    })
    .catch((err) => {
      console.error('Failed to haggle', err);
      res.sendStatus(500);
    });
});

// DELETE: Purchase an artwork and remove it from the Black Market
blackMarketRouter.delete('/db/blackmarket/buy/:_id', (req, res) => {
  const { _id } = req.params;
  const userId = req.user.doc._id;
  const { name, googleId } = req.user.doc;

  BlackMarketArt.findById(_id)
    .then((listing) => {
      if (!listing) return res.sendStatus(404);

      return User.findById(userId).then((user) => {
        if (user.wallet < listing.price) return res.status(400).send('Insufficient funds');

        return User.findByIdAndUpdate(userId, { $inc: { wallet: -listing.price } })
          .then(() => Vault.findOneAndUpdate(
            { owner: userId },
            { $push: { artGallery: listing.artwork } },
          ))
          .then(() => Art.findByIdAndUpdate(listing.artwork, { userGallery: { name, googleId } }))
          .then(() => BlackMarketArt.findByIdAndDelete(_id))
          .then(() => res.sendStatus(200));
      });
    })
    .catch((err) => {
      console.error('Failed to purchase art', err);
      res.sendStatus(500);
    });
});

module.exports = blackMarketRouter;
