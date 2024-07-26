const axios = require('axios');
require('dotenv').config();

const { APIKEY } = process.env;

// Initial api request for images results with a user-supplied keyword
const getArtImages = (keyword) => axios.get('https://api.harvardartmuseums.org/image', {
  params: {
    q: `description:${keyword}`,
    apikey: APIKEY,
    sort: 'random',
  },
});

// After DB functions are imported, create document for each artwork
/**
  imageid
  alttext
  baseimageurl or primaryimageurl
*/

// Secondary api request for full object associated with imageid from above image objects
const getArtObj = (imageid) => axios(
  `https://api.harvardartmuseums.org/object?q=images.imageid:${imageid}&apikey=${APIKEY}`,
);

//   /**
//     images[0].baseimageurl
//     images[0].description
//     century
//     culture
//     people[0].displayname
//     dated
//   */

module.exports = { getArtImages, getArtObj };
