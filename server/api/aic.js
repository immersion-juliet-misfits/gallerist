/* eslint-disable arrow-body-style */
/* eslint-disable comma-dangle */
/* eslint-disable implicit-arrow-linebreak */

// Requests to the Art Institute of Chicago
const axios = require('axios');
require('dotenv').config();

/*
AIC API request
Need the fields: id, title, image_id (to construct url for displaying the image)
*/

/*
 V1: AIC wants "AIC-User-Agent header w/name of project & contact email* added to reqs
 const getAICart = () =>
   axios('https://api.artic.edu/api/v1/artworks?fields=id,title,image_id', {
     headers: {
       'AIC-User-Agent': 'Gallerist - Senior Legacy Assignment (tremartin3003@gmail.com)'
     }
   });
*/

// V2: WIP them from a random page:
const getAICart = () => {
  // Generate random page number
  const rando = Math.floor(Math.random() * 200) + 1;
  // console.log('RandoNum Check: ', rando);
  return axios(
    `https://api.artic.edu/api/v1/artworks?page=${rando}&fields=id,title,image_id`,
    {
      headers: {
        'AIC-User-Agent':
          'Gallerist - Senior Legacy Assignment (tremartin3003@gmail.com)',
      },
    }
  );
};

// *****************************************************
/*
 Placeholder for Nookipedia API request if access is granted in time
 const getACArt = (imageid) => axios(
   `https://api.harvardartmuseums.org/object?q=images.imageid:${imageid}&apikey=${APIKEY}`,
 );

Fake Image URL & Id
Real Image URL & Id
*/

module.exports = { getAICart };
// module.exports = { getAICart, mergeURL };
