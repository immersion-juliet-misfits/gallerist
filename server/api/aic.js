/* eslint-disable arrow-body-style */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */

// Requests to the Art Institute of Chicago
const axios = require('axios');
require('dotenv').config();

/*
AIC API request
Starting with Retrieving 2, will move up to 10 once working
Need Fields: id, title, image_id (to construct url for displaying the image)
*/

// V1: tested - pulls 1st 12 images from APIs page 1
const getAICart = () =>
  axios('https://api.artic.edu/api/v1/artworks?fields=id,title,image_id');

// V2: WIP them from a random page:
/*

const getAICart = () => {
// Generate random page number ( 1 - 10 is good enough)
const shufflePages = Math.floor(Math.random() * 10) + 1

  axios(`https://api.artic.edu/api/v1/artworks?page=${shufflePages}&limit=1&fields=id,title,image_id`);
}
*/

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
