// Temporary disable weird rules
/* eslint-disable arrow-body-style */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
// Requests to the Art Institute of Chicago
const axios = require('axios');
require('dotenv').config();

// AIC requires no API under a certain limit
// const { APIKEY } = process.env;

/*
AIC API request
Starting with Retrieving 2, will move up to 10 once working
Need Fields:
id for tracking what has been pulled
title to display as part of the game
image_id to construct url for displaying the image
*/

const getAICart = () => axios('https://api.artic.edu/api/v1/artworks?fields=id,title,image_id');

// const getAICart = () => {
//   return axios('https://api.artic.edu/api/v1/artworks?fields=id,title,image_id')
//     .then((response) => {
//       console.log('AIC.js Data Verification: ', response.data);
//       return response.data;
//     })
//     .catch((err) => {
//       console.error('Data Fetch From AIC: Failed', err);
//     });
// };

// Use retrieved id to get full image URL
// const mergeURL = (imageId) => {
//   return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
// };
// ESLint wants the below version
// const mergeURL = (imageId) =>
//   `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;

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

module.exports = { getAICart };
// module.exports = { getAICart, mergeURL };
