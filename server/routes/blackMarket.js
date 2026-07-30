/* eslint-disable max-len */
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
      voucherValue: 20000,
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
      // filter out existing vouchers so we only count actual art
      const art = listings.filter((item) => item.itemType !== 'voucher');
      const artCount = art.length;
      let voucherCount = 0;

      // if the black market isn't full- we use vouchers to fill it
      if (artCount < 3) {
        voucherCount = 3 - artCount;
      // if black market is full- still a chance for a voucher to appear
      } else if (Math.random() < 0.05) { voucherCount = 1; }

      // create voucher objects
      const vouchers = Array(voucherCount).fill(null).map((_, i) => ({
        _id: `voucher_${Date.now()}_${i}`,
        title: 'Voucher',
        imageUrl: 'https://i.postimg.cc/ZK71b1QY/voucher-square.jpg',
        itemType: 'voucher',
        price: 5000,
        voucherValue: 20000,
      }));

      // combine art and vouchers, then shuffle and slice
      const combined = [...art, ...vouchers];
      const shuffled = combined.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);

      res.status(200).send(selected);
    })
    .catch((err) => {
      console.error('Failed to retrieve Black Market Art listings', err);
      res.sendStatus(500);
    });
});

// PATCH route that redeems one of a user's vouchers.
blackMarketRouter.patch('/db/blackmarket/voucher', (req, res) => {
  const userId = req.user.doc._id;

  User.findById(userId)
    .then((user) => {
      if (!user || !user.vouchers || user.vouchers < 1) {
        return res.status(400).send('No vouchers to redeem');
      }

      return User.findByIdAndUpdate(userId, { $inc: { wallet: 20000, vouchers: -1 } })
        .then(() => res.sendStatus(200));
    })
    .catch((err) => {
      console.error('Failed to redeem voucher', err);
      res.sendStatus(500);
    });
});

// PATCH route that allows a user to haggle
blackMarketRouter.patch('/db/blackmarket/haggle', (req, res) => {
  const { listingIds, vouchers } = req.body;

  if ((!listingIds || listingIds.length === 0) && (!vouchers || vouchers.length === 0)) {
    return res.sendStatus(400);
  }

  // 50/50 chance for success or failure
  const isSuccess = Math.random() >= 0.5;
  // on success = 75% of cost, -25% discount
  // on fail = 125% of cost, +25% increase
  const multiplier = isSuccess ? 0.75 : 1.25;

  // handle DB items
  const artPromise = listingIds && listingIds.length > 0
    ? BlackMarketArt.find({ _id: { $in: listingIds } })
      .then((listings) => Promise.all(listings.map((listing) => {
        let newPrice = Math.max(10, Math.floor((listing.price || 5000) * multiplier));
        return BlackMarketArt.findByIdAndUpdate(listing._id, { price: newPrice, $inc: { haggleCount: 1 } }, { new: true });
      })))
    : Promise.resolve([]);

  artPromise.then((updatedListings) => {
    // handle vouchers in-memory
    const updatedVouchers = (vouchers || []).map((v) => ({
      ...v,
      price: Math.max(10, Math.floor(v.price * multiplier))
    }));
    res.status(200).send({
      success: isSuccess,
      listings: updatedListings,
      vouchers: updatedVouchers,
    });
  })
    .catch((err) => {
      console.error('Failed to haggle', err);
      res.sendStatus(500);
    });
});

// DELETE: Purchase an artwork and remove it from the Black Market or redeem voucher
blackMarketRouter.delete('/db/blackmarket/buy/:_id', (req, res) => {
  const { _id } = req.params;
  const userId = req.user.doc._id;
  const { name, googleId } = req.user.doc;

  // reset prices after a purchase
  const resetRemainingPrices = () => BlackMarketArt.updateMany(
    { ownerId: 'black_market' },
    { price: 5000, haggleCount: 0 },
  );

  if (_id.startsWith('voucher_')) {
    return User.findByIdAndUpdate(userId, {
      $inc: { wallet: -5000, vouchers: 1 },
    })
      .then(() => resetRemainingPrices())
      .then(() => res.sendStatus(200))
      .catch((err) => res.status(500).send(err));
  }

  BlackMarketArt.findById(_id)
    .then((listing) => {
      if (!listing) return res.sendStatus(404);

      return User.findById(userId).then((user) => {
        if (user.wallet < listing.price) return res.status(400).send('Insufficient funds');

        return User.findByIdAndUpdate(userId, { $inc: { wallet: -listing.price } })
          .then(() => Vault.findOneAndUpdate({ owner: userId }, { $push: { artGallery: listing.artwork } }))
          .then(() => Art.findByIdAndUpdate(listing.artwork, { userGallery: { name, googleId } }))
          .then(() => BlackMarketArt.findByIdAndDelete(_id))
          .then(() => resetRemainingPrices())
          .then(() => res.sendStatus(200));
      });
    })
    .catch((err) => {
      console.error('Failed to purchase item', err);
      res.sendStatus(500);
    });
});

module.exports = blackMarketRouter;
