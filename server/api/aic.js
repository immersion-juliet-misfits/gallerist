/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
// Requests to the Art Institute of Chicago
const axios = require('axios');
require('dotenv').config();

// AIC requires no API under a certain limit
// const { APIKEY } = process.env;

/*
AIC API request
Starting with Retrieving 2, will move up to 20 once working
Need Fields:
id for tracking what has been pulled
title to display as part of the game
image_id to construct url for displaying the image
*/
const getAicArt = () => {
  axios(
    'https://api.artic.edu/api/v1/artworks?limit=s&fields=id,image_id,title'
  );
};

// Use retrieved id to get full image URL
// const mergeURL = (imageId) => {
//   return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
// };
// ESLint wants the below version
const mergeURL = (imageId) =>
  `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;

//

// *****************************************************
// Placeholder for Nookipedia API request if access is granted in time
// const getACArt = (imageid) => axios(
//   `https://api.harvardartmuseums.org/object?q=images.imageid:${imageid}&apikey=${APIKEY}`,
// );

/*
Fake Image URL & Id
Real Image URL & Id
*/

module.exports = { getAicArt, mergeURL };
