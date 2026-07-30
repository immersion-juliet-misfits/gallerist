const { Art } = require('./index');
const hardcodedArtObjs = require('./fakeData');

const seedMongo = () => Art.deleteMany({})
  .then(({ deletedCount }) => {
    // first tells us how many deleted if it succeeded in deleting
    console.log(
      ` Database (MongoDB): ${deletedCount} 'artworks' have been removed from the 'Gallerist' database `,
    );
    // seed it with sample data
    return Art.insertMany(hardcodedArtObjs);
  })
  .then((artObjs) => console.log(
    ` Database (MongoDB): ${artObjs.length} "artworks" have been created in "Gallerist" database `,
  ))
  .catch((err) => console.error(
    ' Database (MongoDB): Failed to seed "art" collection in "Gallerist" database ',
    err,
  ))
  .finally(() => process.exit(0));

// this seed was causing duplicates- instead of relying on seed, go to search
// seedMongo();
